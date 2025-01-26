import { View, Text } from "react-native";
import React from "react";

interface InfoBoxProps {
  title: React.ReactNode;
  subtitle: string;
  titleClassName: string;
  containerClassName?: string;
}

const InfoBox = ({title, subtitle, titleClassName, containerClassName}:InfoBoxProps) => {
  return (
    <View className={containerClassName}>
      <Text className={`text-white text-center font-psemibold ${titleClassName}`}>{title}</Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">{subtitle}</Text>
    </View>
  );
};

export default InfoBox;
