
import {  Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';

export  const Test = () =>{
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView className="flex-1 p-4">
        
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-6 pt-2">
          <View>
            <Text className="text-slate-400 text-sm">Welcome back,</Text>
            <Text className="text-white text-2xl font-bold">Admin Dashboard</Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-indigo-600 items-center justify-center shadow-lg shadow-indigo-500/50">
            <Text className="text-white font-bold text-lg">A</Text>
          </View>
        </View>

        {/* Stats Overview Card */}
        <View className="bg-slate-800 p-5 rounded-2xl border border-slate-700 mb-6 shadow-md">
          <Text className="text-slate-400 text-sm font-medium mb-1">Total Store Revenue</Text>
          <Text className="text-3xl font-extrabold text-white mb-3">$48,250.00</Text>
          <View className="flex-row items-center bg-emerald-500/10 px-3 py-1 rounded-full self-start border border-emerald-500/20">
            <Text className="text-emerald-400 text-xs font-semibold">+14.2% from last month</Text>
          </View>
        </View>

        {/* Action Buttons Grid */}
        <View className="flex-row gap-4 mb-6">
          <TouchableOpacity className="flex-1 bg-indigo-600 p-4 rounded-xl items-center shadow-md active:bg-indigo-700">
            <Text className="text-white font-bold text-sm">+ Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-xl items-center active:bg-slate-700">
            <Text className="text-slate-200 font-bold text-sm">View Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Products List Header */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-white text-lg font-bold">Recent Inventory</Text>
          <TouchableOpacity>
            <Text className="text-indigo-400 text-sm font-medium">See All</Text>
          </TouchableOpacity>
        </View>

        {/* Product Items */}
        <View className="gap-3 mb-8">
          <View className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <View className="w-12 h-12 bg-slate-700 rounded-lg mr-3 items-center justify-center">
                <Text className="text-slate-400 text-xs">IMG</Text>
              </View>
              <View>
                <Text className="text-white font-semibold text-base">Wireless Headphones</Text>
                <Text className="text-slate-400 text-xs">Stock: 42 units</Text>
              </View>
            </View>
            <Text className="text-indigo-400 font-bold text-base">$129.00</Text>
          </View>

          <View className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 flex-row items-center justify-between">
            <View className="flex-row items-center space-x-3">
              <View className="w-12 h-12 bg-slate-700 rounded-lg mr-3 items-center justify-center">
                <Text className="text-slate-400 text-xs">IMG</Text>
              </View>
              <View>
                <Text className="text-white font-semibold text-base">Smart Watch Series 5</Text>
                <Text className="text-slate-400 text-xs">Stock: 18 units</Text>
              </View>
            </View>
            <Text className="text-indigo-400 font-bold text-base">$249.00</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


//  "backgroundImage": "./assets/android-icon-background.png",
//         "monochromeImage": "./assets/android-icon-monochrome.png"