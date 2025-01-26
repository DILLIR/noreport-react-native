import { FlatList, RefreshControl, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppwrite } from "../../hooks/useAppwrite";
import { searchPosts } from "../../services/appwrite";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";

import SearchInput from "../../components/SearchInput";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data, refresh } = useAppwrite(searchPosts, query.toString());

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  useEffect(() => {
    refresh();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={data}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <View className="flex-col justify-between items-start mb-6">
              <Text className="font-pmedium text-sm text-gray-100">
                Search results
              </Text>
              <Text className="text-2xl text-psemibold text-white">
                {query}
              </Text>
            </View>
            <SearchInput initialQuery={query.toString()} />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="Try searching for something else"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Search;
