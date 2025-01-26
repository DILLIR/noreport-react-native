import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { VideosDocument } from "../types/schema";
import { icons } from "../constants";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEventListener } from "expo";
import { cssInterop } from "nativewind";
import Avatar from "./Avatar";

const VideoCard = ({
  video: {
    title,
    thumbnail,
    sourceURL,
    creator: { username, avatar },
  },
}: {
  video: VideosDocument;
}) => {
  const [play, setPlay] = useState(false);

  const player = useVideoPlayer(sourceURL, (player) => {
    player.loop = false;
    player.currentTime = 0;
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
    <View className="flex-col items-center px-4 mb-14 ">
      <View className="flex-row gap-3 items-start">
        <View className="justify-center items-center flex-row flex-1">
          <Avatar uri={avatar} />
          <View className="justify-center flex-1 gap-y-1 ml-3">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-gray-100 font-pregular text-xs"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />
        </View>
      </View>

      {play ? (
        <VideoView
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          className="w-full h-60 rounded-xl mt-3"
          nativeControls
          shouldRasterizeIOS
          contentFit="cover"
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="absolute w-12 h-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
