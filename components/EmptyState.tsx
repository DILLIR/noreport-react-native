import { View, Image, Text } from "react-native";
import React from "react";

import { images } from "../constants";
import CustomButton from "./CustomButton";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  button?: {
    title: string;
    handlePress: () => void;
  };
}

const EmptyState = ({ title, subtitle, button }: EmptyStateProps) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className="text-xl text-center mt-2 text-psemibold text-white">
        {title}
      </Text>
      <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>

      {button != null && <CustomButton containerStyles="w-full my-5" {...button} />}
    </View>
  );
};

export default EmptyState;
