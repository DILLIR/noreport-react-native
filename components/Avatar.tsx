import { View, Text, Image } from "react-native";
import React from "react";

interface AvatarProps {
  uri: string;
  name?: string;
  containerClassName?: string;
  imageClassName?: string;
}

const Avatar = ({
  uri,
  name,
  containerClassName,
  imageClassName,
}: AvatarProps) => {
  return (
    <View
      className={`flex-col items-center justify-center gap-y-3 ${containerClassName}`}
    >
      <View
        className={`w-12 h-12 rounded-lg border-secondary justify-center items-center overflow-hidden border-[2px] ${imageClassName}`}
      >
        {uri != "" && <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />}
      </View>
      {name != null && (
        <Text className="text-white text-2xl text-pbold">{name}</Text>
      )}
    </View>
  );
};

export default Avatar;
