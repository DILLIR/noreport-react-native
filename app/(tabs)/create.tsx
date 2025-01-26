import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { useVideoPlayer, VideoSource, VideoView } from "expo-video";
import * as ImagePicker from "expo-image-picker";

import { icons } from "../../constants";
import { router } from "expo-router";
import { createVideo } from "../../services/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

export interface Form {
  title: string;
  video: ImagePicker.ImagePickerAsset | null;
  thumbnail: ImagePicker.ImagePickerAsset | null;
  prompt: string;
}

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<Form>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const player = useVideoPlayer(form.video?.uri as VideoSource, (player) => {
    player.loop = false;
    player.currentTime = 0;
  });

  const openPicker = async (selectType: "thumbnail" | "video") => {
    const result = await await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === "thumbnail" ? "images" : "videos",
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setForm({ ...form, [selectType]: result.assets[0] });
    }
  };

  const onSubmit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      Alert.alert("Please fill all fields");
      return;
    }

    setUploading(true);

    try {
      await createVideo({ ...form, userId: user?.$id || '' });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Error uploading video", error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload video</Text>
        <View className="mt-8 flex-col gap-y-5">
          <FormField
            title={"Video title"}
            value={form.title}
            placeholder="Give your video a catchy title"
            handleChangeText={(text) => setForm({ ...form, title: text })}
          />
          <View className="space-y-2">
            <Text className="text-gray-100 font-pmedium text-base">
              Upload video
            </Text>
            <TouchableOpacity onPress={() => openPicker("video")}>
              {form.video ? (
                <VideoView
                  player={player}
                  allowsFullscreen
                  allowsPictureInPicture
                  className="w-full h-64 rounded-2xl mt-3"
                  shouldRasterizeIOS
                  contentFit="cover"
                />
              ) : (
                <View className="w-full h-60 px-4 bg-black-100 rounded-2xl xl mt-3 justify-center items-center">
                  <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                    <Image
                      source={icons.upload}
                      className="w-7 h-7"
                      resizeMode="contain"
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View className="mt-7 space-y-2">
            <Text className="text-gray-100 font-pmedium text-base mb-2">
              Thumbnail image
            </Text>
            <TouchableOpacity onPress={() => openPicker("thumbnail")}>
              {form.thumbnail ? (
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="w-full h-16 border-2 border-black-200 flex-row gap-x-2 px-4 bg-black-100 rounded-2xl mt-3 justify-center items-center">
                  <Image
                    source={icons.upload}
                    className="w-5 h-5"
                    resizeMode="contain"
                  />
                  <Text className="text-sm text-gray-100 font-pmedium">
                    Choose file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <FormField
            title={"AI Propmpt"}
            value={form.prompt}
            placeholder="The AI prompt of your video"
            handleChangeText={(text) => setForm({ ...form, prompt: text })}
          />
          <CustomButton
            title="Submit & Publish"
            containerStyles="mt-8"
            isLoading={uploading}
            handlePress={onSubmit}
          ></CustomButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
