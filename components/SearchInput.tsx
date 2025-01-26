import { View, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({ initialQuery }: { initialQuery?: string }) => {
  const pathname = usePathname();

  const [query, setQuery] = useState(initialQuery || '');

  return (
    <View className="w-full h-16 px-4 bg-black-100 rounded-lg focus:border-secondary flex-row items-center space-x-4">
      <TextInput
        className="text-base mt-0.5 text-white font-pregular flex-1"
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor={"#cdcde0"}
        onChangeText={(value) => {
          setQuery(value);
        }}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please input something to search results across database"
            );
          }

          if (pathname === "/search") {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image source={icons.search} className="w-6 h-6" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
