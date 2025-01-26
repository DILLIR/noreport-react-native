import {
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  ViewToken,
} from "react-native";
import React, { useState } from "react";
import { VideosDocument } from "../types/schema";
import * as Animatable from "react-native-animatable";
import { icons } from "../constants";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEventListener } from "expo";
import { cssInterop } from "nativewind";

const zoomIn: Animatable.CustomAnimation<any> = {
  0: {
    scale: 0.8,
  },
  1: {
    scale: 1,
  },
};

const zoomOut: Animatable.CustomAnimation<any> = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.8,
  },
};

const TrendingItem = ({
  activeItem,
  item,
}: {
  activeItem: boolean;
  item: VideosDocument;
}) => {
  const [play, setPlay] = useState(false);

  const player = useVideoPlayer(item.sourceURL, (player) => {
    player.loop = false;
  });

  useEventListener(player, "playToEnd", () => {
    setPlay(false);
  });

  cssInterop(VideoView, {
    className: {
      target: "style",
    },
  });

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem ? zoomIn : zoomOut}
      duration={300}
    >
      {play ? (
        <VideoView
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          nativeControls
          shouldRasterizeIOS
          contentFit="cover"
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="absolute w-12 h-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

interface TrendingProps {
  posts: VideosDocument[];
}

const Trending = ({ posts }: TrendingProps) => {
  const [activeItem, setActiveItem] = useState<string | undefined>(undefined);

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken<VideosDocument>[];
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem === item.$id} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 100, y: 0 }}
      horizontal
    />
  );
};

export default Trending;
