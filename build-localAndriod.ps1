<#
  Local Android preview build -> install -> launch  (Windows / PowerShell)
 
  Why: `eas build --local` cannot build Android on Windows (needs macOS/Linux), so
  this runs Gradle directly with the SAME command as the eas.json `preview` profile.
  Untracked on purpose (see .gitignore).
 
  Usage (from anywhere; run in PowerShell):
      .\build-localAndriod.ps1                 # build + install + launch. Backend = the corp DEV
                                        # hosts over HTTPS (.env) -> THE DEVICE
                                        # needs the VPN. No dev-proxy required.
      .\build-localAndriod.ps1 -Proxy          # backend = the dev-proxy on this PC (.env.local, same
                                        # as `npm start dev`) -> device needs NO VPN, but
                                        # `npm run proxy` must be running here.
      .\build-localAndriod.ps1 -Clean          # wipe app\build + app\.cxx first (rarely needed - the
                                        # JS bundle is force-regenerated on every run anyway)
      .\build-localAndriod.ps1 -Uninstall      # uninstall the app first (fixes signature mismatch)
      .\build-localAndriod.ps1 -Phone          # arm64-v8a -> the APK to COPY to a real phone. The
                                        # default builds only the ATTACHED device's ABI, so an
                                       # emulator build (x86_64) says "app isn't compatible
                                        # with your phone" on a handset.
      .\build-localAndriod.ps1 -AllAbis        # all 3 ABIs (biggest APK; only if a target is 32-bit)
      .\build-localAndriod.ps1 -NoShrink       # disable R8/resource shrinking (on by default; use this
                                        # to rule R8 out if something breaks only in a release APK)
      .\build-localAndriod.ps1 -Clean -Uninstall
 
  If PowerShell blocks the script:
      powershell -ExecutionPolicy Bypass -File .\build-localAndriod.ps1
#>
param(
  [switch]$Clean,
  [switch]$Uninstall,
  [switch]$AllAbis,
  [switch]$Proxy,
  [switch]$NoShrink,
  [switch]$Phone
)
 
$pkg     = 'reactapp'
$abis    = 'arm64-v8a,armeabi-v7a,x86_64'
$android = Join-Path $PSScriptRoot 'android'
$apk     = Join-Path $android 'app\build\outputs\apk\release\app-release.apk'
# Friendly output name (Gradle always emits app-release.apk; we copy it to this).
$named   = Join-Path $PSScriptRoot 'faykaa.apk'
 
$env:SENTRY_DISABLE_AUTO_UPLOAD = 'true'   # no Sentry token needed for a local build
 
# --- env: pick the backend path ----------------------------------------------
# TWO modes, because the two setups need opposite things:
#
#   (default)  DIRECT   - .env only. The APK talks straight to
#                         https://auth8.dev.zoolwork.com / sp-ai.dev.zoolwork.com.
#                         Those resolve to 10.1.0.4 (private), so THE DEVICE ITSELF
#                         must have the corp VPN connected. No proxy, nothing to
#                         keep running on this PC. Use this for a phone on VPN.
#   -Proxy              - .env overlaid by .env.local, i.e. exactly what
#                         `npm start dev` gives Metro: http://<host>:8790/8791 ->
#                         dev-proxy on this PC -> VPN -> the corp hosts. The DEVICE
#                         needs no VPN, but `npm run proxy` must be RUNNING here.
#
# Why pin as PROCESS env instead of letting Expo read the files: a RELEASE build
# loads .env.production + .env.local and NEVER .env. Unpinned,
# SOCKET_URL / FILES_CDN_URL / APP_ENV / OAUTH_CLIENT_ID would come from
# .env.production (public hosts) - two backends in one APK - and
# src/shared/config/env.ts THROWS at startup on any missing var. Expo never
# overwrites an already-defined var (@expo/env: "already defined and IS NOT
# overwritten"), so process env wins over every .env file. In DIRECT mode this is
# also what stops .env.local (rewritten by every `npm start`) leaking in.
$envDev   = Join-Path $PSScriptRoot '.env'
$envLocal = Join-Path $PSScriptRoot '.env.local'
if (-not (Test-Path $envDev)) {
  Write-Host "Missing .env - the build would have no backend URLs and the app throws at startup." -ForegroundColor Red
  exit 1
}
if ($Proxy -and -not (Test-Path $envLocal)) {
  Write-Host "-Proxy needs .env.local - run 'npm start dev' once to generate it, then rebuild." -ForegroundColor Red
  exit 1
}
function Read-EnvFile($path) {
  $h = @{}
  foreach ($line in Get-Content $path) {
    if ($line -match '^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$') { $h[$Matches[1]] = $Matches[2] }
  }
  return $h
}
$merged = Read-EnvFile $envDev
$source = '.env'
if ($Proxy) {
  foreach ($kv in (Read-EnvFile $envLocal).GetEnumerator()) { $merged[$kv.Key] = $kv.Value }
  $source = '.env.local overlaid on .env'
}
 
foreach ($kv in $merged.GetEnumerator()) {
  if ($kv.Key -like 'EXPO_PUBLIC_*') { [Environment]::SetEnvironmentVariable($kv.Key, $kv.Value, 'Process') }
}
$required = @()
$absent = $required | Where-Object { -not $merged[$_] }
if ($absent) {
  Write-Host "These vars are missing from $source, so the app would throw at startup:" -ForegroundColor Red
  $absent | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
  exit 1
}
 
$authUrl   = $merged['EXPO_PUBLIC_AUTH_URL']
$proxyMode = $authUrl -match '^http://'
Write-Host "Backend: $authUrl (auth) / $($merged['EXPO_PUBLIC_API_URL']) (api)" -ForegroundColor Cyan
Write-Host "APP_ENV: $($merged['EXPO_PUBLIC_APP_ENV'])   [from $source]" -ForegroundColor Cyan
if ($proxyMode) {
  Write-Host "MODE: dev-proxy - the DEVICE needs no VPN, but this PC does, and the proxy must be RUNNING:" -ForegroundColor Yellow
  Write-Host "      npm run proxy      (in another terminal - a standalone APK cannot start it for you)" -ForegroundColor Yellow
  # A listening port answering anything at all is proof enough.
  $proxyPort = ([regex]::Match($authUrl, ':(\d+)')).Groups[1].Value
  $up = $false
  try { $null = Invoke-WebRequest "http://127.0.0.1:$proxyPort/" -TimeoutSec 3 -UseBasicParsing; $up = $true }
  catch { $up = $_.Exception.Response -ne $null }
  if ($up) { Write-Host "      proxy on :$proxyPort is UP" -ForegroundColor Green }
  else     { Write-Host "      WARNING: nothing is listening on :$proxyPort - login will fail until you start it." -ForegroundColor Yellow }
  if ($authUrl -match '10\.0\.2\.2') {
    Write-Host "      10.0.2.2 is the ANDROID EMULATOR alias for this PC. On a physical phone it is unreachable -" -ForegroundColor Yellow
    Write-Host "      plug the phone in and re-run 'npm start dev' so .env.local gets this PC's LAN IP, then rebuild." -ForegroundColor Yellow
  }
} else {
  Write-Host "MODE: direct HTTPS over the VPN - no dev-proxy involved, nothing to keep running here." -ForegroundColor Yellow
  Write-Host "      THE DEVICE running this APK must have the corp VPN connected (these hosts are private)." -ForegroundColor Yellow
  # Resolve from this PC purely as a sanity check on the VPN/DNS of the build machine.
  foreach ($h in @($authUrl, $merged['EXPO_PUBLIC_API_URL'])) {
    $name = ([regex]::Match($h, '^https?://([^:/]+)')).Groups[1].Value
    try {
      $ip = (Resolve-DnsName -Name $name -Type A -ErrorAction Stop | Where-Object { $_.IPAddress } | Select-Object -First 1).IPAddress
      Write-Host "      $name -> $ip" -ForegroundColor DarkGray
    } catch {
      Write-Host "      $name -> DOES NOT RESOLVE from this PC (VPN down here?). The device will fail the same way." -ForegroundColor Yellow
    }
  }
  Write-Host "      Emulator note: it inherits this PC's DNS at STARTUP. If the VPN came up after the" -ForegroundColor Yellow
  Write-Host "      emulator did, cold-boot the emulator - or use -Proxy, which needs no device VPN." -ForegroundColor Yellow
}
 
# --- release builds block cleartext HTTP - permit it for the proxy host only ---
# android/app/src/debug/AndroidManifest.xml sets usesCleartextTraffic="true" for
# DEBUG only; the merged RELEASE manifest sets nothing and targetSdk >= 28 defaults
# it to FALSE. So an http:// proxy URL in a release APK is blocked before a packet
# leaves the device - that is why the earlier APK built with http://10.0.2.2:8790
# failed every login even with the proxy running.
#
# Written per build so the exception covers exactly the host .env.local names (and
# nothing else); base-config stays cleartext-FORBIDDEN. In a non-proxy build the
# file is regenerated with no exception at all, so build-playstore.ps1 output is
# not loosened by having run this script.
#
# NOTE: plugins/withCertificatePinning.js writes this same path - but only during
# `expo prebuild`, which this script never runs. If you ever prebuild, re-run this
# script afterwards.
$xmlDir  = Join-Path $android 'app\src\main\res\xml'
$nscFile = Join-Path $xmlDir 'network_security_config.xml'
$exception = ''
if ($proxyMode) {
  $proxyHost = ([regex]::Match($authUrl, '^http://([^:/]+)')).Groups[1].Value
  $exception = @"
  <!-- dev-proxy on the build machine; cleartext ONLY for this host. -->
  <domain-config cleartextTrafficPermitted="true">
    <domain includeSubdomains="false">$proxyHost</domain>
  </domain-config>
"@
}
New-Item -ItemType Directory -Force -Path $xmlDir | Out-Null
$nscXml = @"
<?xml version="1.0" encoding="utf-8"?>
<!-- AUTO-GENERATED by build-local.ps1. Do not edit by hand. -->
<network-security-config>
  <base-config cleartextTrafficPermitted="false" />
$exception
</network-security-config>
"@
# WriteAllText with UTF8Encoding($false), NOT Set-Content -Encoding utf8: PS 5.1
# writes a BOM, and a BOM in files aapt2 parses is a needless risk.
$noBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($nscFile, $nscXml, $noBom)
 
# Point the manifest at it (idempotent - only inserted when absent).
$manifest = Join-Path $android 'app\src\main\AndroidManifest.xml'
$mText = Get-Content $manifest -Raw
if ($mText -notmatch 'android:networkSecurityConfig') {
  $mText = $mText -replace '(<application\b)', '$1 android:networkSecurityConfig="@xml/network_security_config"'
  [System.IO.File]::WriteAllText($manifest, $mText, $noBom)
  Write-Host "Patched AndroidManifest.xml with android:networkSecurityConfig." -ForegroundColor Cyan
}
if ($proxyMode) { Write-Host "Cleartext permitted for $proxyHost only (release builds block http by default)." -ForegroundColor Cyan }
 
# --- JDK ----------------------------------------------------------------------
# JDK 17 is not a preference here, it is a requirement:
# @react-native/gradle-plugin's included builds declare `kotlin { jvmToolchain(17) }`,
# so Gradle needs a Java 17 installation it can SEE. When it can't find one it tries
# to DOWNLOAD a toolchain through the bundled foojay resolver, which on Gradle 9.3.1
# dies with the useless
#     "Class org.gradle.jvm.toolchain.JvmVendorSpec does not have member field
#      'org.gradle.jvm.toolchain.JvmVendorSpec IBM_SEMERU'"
# (the resolver still references a field Gradle 9 removed). That message says nothing
# about JDKs, so: find every JDK, hand the list to Gradle below via
# org.gradle.java.installations.paths, and turn auto-download OFF so a genuinely
# missing JDK fails with a readable error instead of that one.
#
# Android Studio's bundled JBR is Java 25 - newer than AGP 8.12 / Kotlin 2.1 support -
# so it is only ever the last resort, and an inherited JAVA_HOME pointing at it is
# overridden when a real JDK 17/21 exists.
$jdkRoots = @(Join-Path $env:LOCALAPPDATA 'Programs'), 'C:\Program Files\Eclipse Adoptium', 'C:\Program Files\Java'
$jdks = @()
foreach ($root in $jdkRoots) {
  if (Test-Path $root) {
    $jdks += Get-ChildItem $root -Directory -ErrorAction SilentlyContinue |
             Where-Object { Test-Path (Join-Path $_.FullName 'bin\javac.exe') } |
             ForEach-Object { $_.FullName }
  }
}
# jvmToolchain(17) first, then 21 (Gradle 9.3.1 + AGP 8.12 both run on either).
$jdk17 = $jdks | Where-Object { (Split-Path $_ -Leaf) -match 'jdk-?17' } | Select-Object -First 1
$jdk21 = $jdks | Where-Object { (Split-Path $_ -Leaf) -match 'jdk-?21' } | Select-Object -First 1
$preferred = if ($jdk17) { $jdk17 } elseif ($jdk21) { $jdk21 } else { $null }
if ($preferred) { $env:JAVA_HOME = $preferred }
elseif (-not $env:JAVA_HOME -and (Test-Path 'C:\Program Files\Android\Android Studio\jbr')) {
  $env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
}
if (-not $jdk17) {
  Write-Host "No JDK 17 found. Kotlin's jvmToolchain(17) will try to download one and fail" -ForegroundColor Yellow
  Write-Host "with a JvmVendorSpec/IBM_SEMERU error. Install Temurin 17 and re-run:" -ForegroundColor Yellow
  Write-Host "  https://api.adoptium.net/v3/binary/latest/17/ga/windows/x64/jdk/hotspot/normal/eclipse" -ForegroundColor Yellow
}
if ($env:JAVA_HOME) { Write-Host "JAVA_HOME: $env:JAVA_HOME" -ForegroundColor DarkGray }
if ($jdks) { Write-Host "JDKs visible to Gradle: $($jdks -join ' | ')" -ForegroundColor DarkGray }
 
# --- Android SDK: resolve it here instead of trusting PATH --------------------
# A shell opened BEFORE the SDK env vars existed has neither ANDROID_HOME nor
# platform-tools on PATH. The only symptom was "'adb' is not recognized" followed
# by "No device/emulator connected" - which blames the device for a PATH problem.
# Gradle needs ANDROID_HOME as well, so resolve both from the default install
# location and pin them for THIS process.
if (-not $env:ANDROID_HOME) {
  $env:ANDROID_HOME = if ($env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT }
                      else { Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
}
if (-not $env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT = $env:ANDROID_HOME }
if (-not (Test-Path (Join-Path $env:ANDROID_HOME 'platform-tools'))) {
  Write-Host "No Android SDK at $env:ANDROID_HOME (no platform-tools inside)." -ForegroundColor Red
  Write-Host "Install it via Android Studio > SDK Manager, or set ANDROID_HOME to the right folder." -ForegroundColor Red
  exit 1
}
Write-Host "ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor DarkGray
 
# Call adb by absolute path - $env:PATH may predate the SDK being installed.
$adb = Join-Path $env:ANDROID_HOME 'platform-tools\adb.exe'
if (-not (Test-Path $adb)) {
  $onPath = Get-Command adb -ErrorAction SilentlyContinue
  if ($onPath) { $adb = $onPath.Source }
  else {
    Write-Host "adb not found at $adb - install 'Android SDK Platform-Tools' in the SDK Manager." -ForegroundColor Red
    exit 1
  }
}
 
# --- require a connected device / emulator ---
$devices = & $adb devices
if (-not ($devices | Where-Object { $_ -match "`tdevice" })) {
  Write-Host "No device/emulator connected. Start an emulator or plug in a phone (USB debugging), then run 'adb devices'." -ForegroundColor Red
  exit 1
}
 
# --- build ONLY the connected device's ABI ------------------------------------
# $abis above lists three, which compiles the whole native side THREE times
# (codegen + CMake + .so per ABI). One target device needs exactly one. That waste
# is what tipped a Gradle worker daemon into an OOM crash on a loaded machine.
# Falls back to the full list if adb can't answer (e.g. >1 device attached).
#
# -AllAbis opts out: the resulting APK runs ONLY on the ABI it was built for, so a
# handoff APK for someone else's phone (arm64-v8a) must not be an x86_64 emulator
# build. Use -AllAbis whenever the APK leaves this machine.
if ($Phone) {
  # For an APK you COPY to a real phone. Every 64-bit ARM Android phone (i.e. all
  # modern ones) installs this; the emulator here also accepts it because its
  # ro.product.cpu.abilist is "x86_64,arm64-v8a". Use -AllAbis instead if a target
  # device is 32-bit only (armeabi-v7a).
  $abis = 'arm64-v8a'
  Write-Host "Device ABI: -Phone given - building arm64-v8a (installs on real phones)." -ForegroundColor Cyan
} elseif ($AllAbis) {
  Write-Host "Device ABI: -AllAbis given - building all of: $abis" -ForegroundColor Cyan
} else {
  $deviceAbi = & $adb shell getprop ro.product.cpu.abi 2>$null | Select-Object -First 1
  if ($deviceAbi) { $deviceAbi = $deviceAbi.Trim() }
  if ($deviceAbi -and $deviceAbi -match '^[a-z0-9_-]+$') {
    $abis = $deviceAbi
    Write-Host "Device ABI: $abis - building that one ONLY. To copy the APK to a phone use -Phone." -ForegroundColor Cyan
  } else {
    Write-Host "Could not read the device ABI - building all of: $abis" -ForegroundColor Yellow
  }
}
 
# --- Gradle JVM memory -------------------------------------------------------
# Expo's template ships `-Xmx2048m -XX:MaxMetaspaceSize=512m`. A cold full build of
# this app (new-arch codegen + CMake per ABI + Kotlin, while Metro bundles at the
# same time) exhausts it: Gradle logs "running out of JVM Metaspace" and then a
# worker dies with "Failed to run Gradle Worker Daemon ... child process have
# crashed". Enforced on EVERY run because /android is gitignored and
# `expo prebuild` regenerates this file with the small defaults.
#
# The same block also turns on R8 + resource shrinking, which is the only lever left
# on APK size once the ABI count is down. Measured on the 3-ABI 89.3 MB APK:
#   lib/ (3 ABIs) 60.9 MB | classes1-5.dex 15.8 | JS bundle 7.1 | res+arsc 4.6
# One ABI removes ~38 MB; R8 then cuts most of the 15.8 MB of dex plus unused res.
# Property names are read by android/app/build.gradle:69 and :139 via findProperty.
# -NoShrink turns both off - use it if a release-only crash appears (R8 can strip
# something a library reaches by reflection).
$gp      = Join-Path $android 'gradle.properties'
$shrink  = if ($NoShrink) { 'false' } else { 'true' }
$gpWant  = [ordered]@{
  'org.gradle.jvmargs'                          = '-Xmx4096m -XX:MaxMetaspaceSize=1536m'
  'org.gradle.workers.max'                      = '4'
  'android.enableMinifyInReleaseBuilds'         = $shrink
  'android.enableShrinkResourcesInReleaseBuilds' = $shrink   # requires minify, keep the two equal
}
# Point jvmToolchain(17) at the JDKs found above. Forward slashes because a
# backslash is an escape character in a .properties file. auto-download=false so a
# missing toolchain says so, instead of crashing inside the foojay resolver.
if ($jdks) {
  $gpWant['org.gradle.java.installations.paths']        = (($jdks | ForEach-Object { $_ -replace '\\', '/' }) -join ',')
  $gpWant['org.gradle.java.installations.auto-detect']  = 'true'
  $gpWant['org.gradle.java.installations.auto-download'] = 'false'
}
$gpText  = Get-Content $gp -Raw
$gpDirty = $false
foreach ($k in $gpWant.Keys) {
  $v  = $gpWant[$k]
  $rx = '(?m)^' + [regex]::Escape($k) + '=.*$'
  if ($gpText -match $rx) {
    if ($gpText -notmatch ('(?m)^' + [regex]::Escape("$k=$v") + '\s*$')) {
      $gpText = [regex]::Replace($gpText, $rx, "$k=$v")
      $gpDirty = $true
      Write-Host "gradle.properties: $k -> $v" -ForegroundColor Cyan
    }
  } else {
    $gpText = $gpText.TrimEnd() + "`r`n$k=$v`r`n"
    $gpDirty = $true
    Write-Host "gradle.properties: $k -> $v (added)" -ForegroundColor Cyan
  }
}
if ($gpDirty) { [System.IO.File]::WriteAllText($gp, $gpText, $noBom) }
if (-not $NoShrink) {
  Write-Host "R8 + resource shrinking ON. Smoke-test login, Najm chat and a PDF download - if" -ForegroundColor Yellow
  Write-Host "anything breaks only in this build, rebuild with -NoShrink to rule R8 out." -ForegroundColor Yellow
}
 
# Gradle + Metro together want several GB. Warn instead of failing 9 minutes in.
$freeGb = [math]::Round((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory / 1MB, 1)
if ($freeGb -lt 5) {
  Write-Host "Only $freeGb GB RAM free - close browsers/other apps, or a worker daemon may crash mid-build." -ForegroundColor Yellow
} else {
  Write-Host "Free RAM: $freeGb GB" -ForegroundColor DarkGray
}
 
# --- force the JS bundle to regenerate --------------------------------------
# Gradle decides createBundleReleaseJsAndAssets is UP-TO-DATE from its input
# FILES. The URLs above are pinned through environment variables, which Gradle
# cannot see - so a plain rebuild happily repackages a stale bundle still
# pointing at whatever .env.local said last time (this shipped an APK whose
# auth URL was http://10.0.2.2:8790 and failed every login). Deleting the task's
# outputs re-runs just the JS bundle (~1-2 min) instead of -Clean (10+ min).
foreach ($stale in @(
  (Join-Path $android 'app\build\generated\assets\react\release'),
  (Join-Path $android 'app\build\intermediates\assets\release\mergeReleaseAssets\index.android.bundle')
)) {
  if (Test-Path $stale) { Remove-Item $stale -Recurse -Force -ErrorAction SilentlyContinue }
}
 
# --- clean: delete the build dirs, do NOT run `gradlew clean` -----------------
# `gradlew clean` is BROKEN here with newArchEnabled=true: it cleans the library
# modules first, deleting each one's build/generated/source/codegen/jni, and then
# :app:externalNativeBuildCleanRelease re-runs CMake CONFIGURE before cleaning.
# Android-autolinking.cmake still add_subdirectory's those just-deleted paths, so
# configure dies with "which is not an existing directory", ninja fails
# ("rebuilding 'build.ninja': subcommand failed") and the whole clean aborts
# before a single line is compiled. Removing the dirs from the filesystem skips
# the CMake step entirely - same result, no failure, and faster.
if ($Clean) {
  foreach ($p in @(
    (Join-Path $android 'app\build'),
    (Join-Path $android 'app\.cxx'),   # stale CMake config that referenced the deleted codegen dirs
    (Join-Path $android 'build')
  )) {
    if (Test-Path $p) {
      Write-Host "clean: removing $p" -ForegroundColor DarkGray
      Remove-Item $p -Recurse -Force -ErrorAction SilentlyContinue
    }
  }
}
 
# --- build -------------------------------------------------------------------
# Invoked by absolute path with `-p <projectDir>` instead of `Set-Location $android`:
# a failure used to `exit 1` from inside android/ and strand the caller's prompt there.
$gradlew = Join-Path $android 'gradlew.bat'
# Remember what Gradle's output looked like, so we can tell a real repackage from
# an UP-TO-DATE no-op (which silently leaves the PREVIOUS binary in place).
$outBefore = (Get-Item $apk -ErrorAction SilentlyContinue).LastWriteTimeUtc
& $gradlew -p $android ":app:assembleRelease" "-PreactNativeArchitectures=$abis"
if ($LASTEXITCODE -ne 0) { Write-Host "Gradle build failed." -ForegroundColor Red; exit 1 }
 
if (-not (Test-Path $apk)) { Write-Host "APK not found at $apk" -ForegroundColor Red; exit 1 }
 
# --- copy to the friendly name (SahabPayroll.apk at repo root) ---
Copy-Item $apk $named -Force
 
# Copy-Item preserves the SOURCE's LastWriteTime, so the friendly-named copy would
# otherwise show Gradle's write time (or an old one, on an UP-TO-DATE build) in
# Explorer. Stamp it with now, so "Date modified" means "this build produced it".
(Get-Item $named).LastWriteTime = Get-Date
 
if ($outBefore -and $outBefore -eq (Get-Item $apk).LastWriteTimeUtc) {
  Write-Host ""
  Write-Host "Gradle did NOT repackage - :app:assembleRelease was UP-TO-DATE." -ForegroundColor Yellow
  Write-Host "This is the PREVIOUS binary; no input changed since the last build." -ForegroundColor Yellow
  Write-Host "Force a fresh one with:  -Clean   (or add --rerun-tasks)" -ForegroundColor Yellow
}
 
# --- report exactly which devices this APK can install on ---------------------
# "App not installed as app isn't compatible with your phone" means only this: the
# APK carries no lib/<abi> the target supports. A build for the attached emulator
# (x86_64) can NEVER install on a phone (arm64-v8a), no matter how the phone is set
# up - so print the truth here instead of letting it surface on the device.
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($named)
$apkAbis = $zip.Entries | Where-Object { $_.FullName -like 'lib/*' } |
           ForEach-Object { ($_.FullName -split '/')[1] } | Sort-Object -Unique
$zip.Dispose()
Write-Host ""
Write-Host ("APK size : {0:N1} MB" -f ((Get-Item $named).Length / 1MB)) -ForegroundColor Green
Write-Host ("Installs on ABI: {0}" -f ($apkAbis -join ', ')) -ForegroundColor Green
if ($apkAbis -notcontains 'arm64-v8a' -and $apkAbis -notcontains 'armeabi-v7a') {
  Write-Host "This APK will NOT install on any real phone - it has no ARM library." -ForegroundColor Yellow
  Write-Host "Rebuild with -Phone (arm64-v8a, ~42 MB) to hand it to a device." -ForegroundColor Yellow
}
 
# --- install (retry after uninstall on signature/incompatible errors) ---
if ($Uninstall) { & $adb uninstall $pkg | Out-Null }
 
& $adb install -r $named
if ($LASTEXITCODE -ne 0) {
  Write-Host "install -r failed; uninstalling and retrying..." -ForegroundColor Yellow
  & $adb uninstall $pkg | Out-Null
  & $adb install $named
  if ($LASTEXITCODE -ne 0) { Write-Host "adb install failed." -ForegroundColor Red; exit 1 }
}
 
# --- launch ---
& $adb shell monkey -p $pkg -c android.intent.category.LAUNCHER 1 | Out-Null
 
Write-Host ""
Write-Host "Done - installed & launched $pkg" -ForegroundColor Green
Write-Host "APK: $named"
 