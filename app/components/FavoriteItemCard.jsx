import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import {
  getAlbumByIdSpotify,
  getSongByIdSpotify,
  getArtistByIdSpotify,
} from "../../api/spotify";
import { COLORS, SIZES } from "../lib/imports";

export default function FavoriteItemCard({ type, id }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        if (type === "album") setData(await getAlbumByIdSpotify(id));
        if (type === "song") setData(await getSongByIdSpotify(id));
        if (type === "artist") setData(await getArtistByIdSpotify(id));
      } catch (err) {
        console.log("FavoriteItemCard error:", err);
      }
    }
    load();
  }, [id]);

  if (!data) {
    return (
      <View
        style={{
          width: SIZES.cover,
          height: SIZES.cover,
          backgroundColor: COLORS.card,
          borderRadius: 8,
          marginRight: 12,
        }}
      />
    );
  }

  return (
    <TouchableOpacity style={{ marginRight: 12 }}>
      <Image
        source={{
          uri: data.coverUrl || data.imageUrl || "https://placehold.co/200x200",
        }}
        style={{
          width: SIZES.cover,
          height: SIZES.cover,
          borderRadius: 8,
        }}
      />

      <Text
        numberOfLines={1}
        style={{
          color: COLORS.text,
          marginTop: 6,
          fontWeight: "700",
          width: SIZES.cover,
        }}
      >
        {data.title || data.name}
      </Text>
    </TouchableOpacity>
  );
}
