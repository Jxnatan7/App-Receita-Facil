import React, { useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Input,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Image,
} from "native-base";

import * as FileSystem from "expo-file-system";

import { SafeAreaView } from "react-native";
import api from "../../services/api";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as ImagePicker from "expo-image-picker";

export default function Register() {
  const navigation = useNavigation();

  const [photo, setPhoto] = useState<any>(null);
  const [ingredientsArray, setIngredientsArray] = useState([""]);

  const handleBackPage = () => {
    navigation.dispatch(CommonActions.goBack());
  };

  const [name, setName] = useState("");
  const [instructions, setInstructions] = useState([""]);
  const [time, setTime] = useState("");
  const [cover, setCover] = useState("");
  const [video, setVideo] = useState("");

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const addIngredient = () => {
    setIngredientsArray([...ingredientsArray, ""]);
  };
  
  console.log(instructions, ingredientsArray);

  const handleChoosePhoto = async () => {
    // Solicitar permissão para acessar a biblioteca de mídia
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      console.error("A permissão para acessar a biblioteca de mídia foi negada.");
      return;
    }

    // Abrir a biblioteca de mídia para selecionar uma imagem
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.cancelled) {
      const imageUri = result.uri;
      try {
        // @ts-ignore
        const photoBase64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setCover(photoBase64);
        setPhoto(result);
      } catch (error) {
        console.log(error);
      }
    }
  };

  async function handleRegister() {

    if (
      name === "" ||
      time === "" ||
      cover === "" ||
      video === ""
    ) {
      return;
    }

    try {
      await api.post("/foods", {
        name: name,
        ingredients: `${ingredientsArray}`,
        instructions: `${instructions}`,
        time: Number(time),
        cover: cover,
        video: video,
        favorite: false,
      });

      // Limpar os campos após o registro
      setName("");
      setIngredientsArray([""]);
      setInstructions([""]);
      setTime("");
      setCover("");
      setVideo("");

      // Navegar de volta para a tela Home
      //@ts-ignore
      navigation.navigate("Home", {
        reload: true,
      });
    } catch (error) {
      console.log(
        `Erro ao cadastrar a comida; ${error}`
      );
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: "#F3F9FF", height: "auto", minHeight: "100%" }}>
      <Flex w="100%" bg="#FFF" pt="30px" pb="10px" px="20px" direction="row" justifyContent="space-between" alignItems="center">
        <Flex direction="row" alignItems="center">
          <Button variant="ghost" onPress={handleBackPage}>
            <FontAwesomeIcon icon="arrow-left" color="#000" size={20}/>
          </Button>
          <Heading ml="20px" fontSize="16px">
            Registre a sua receita favorita
          </Heading>
        </Flex>
      </Flex>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={20}>
        <ScrollView mt="20px">
          <Flex px="20px" pt="30px" pb="100px">
            <Heading fontSize="16px" mb="10px">
              Nome da receita
            </Heading>
            <Input isRequired placeholder="Ex.: Carne de panela" rounded="10px" bg="#FFF" mb="15px" size="lg" value={name} onChangeText={(text) => setName(text)}/>
            
            <Flex direction="row" justifyContent="space-between" alignItems="center" mb="10px">
              <Heading fontSize="16px">
                Ingredientes 
              </Heading>
              <Button variant="ghost" onPress={addIngredient}>
                <FontAwesomeIcon icon="plus" color="#4CBE6C" size={25} />
              </Button>
            </Flex>

            {
              ingredientsArray.map((ingredient: any, index: any) => (
                <Input
                  key={index}
                  placeholder={`Ingrediente ${index + 1}`}
                  value={ingredient}
                  onChangeText={(text) => {
                    const newIngredients = [...ingredientsArray];
                    // @ts-ignore
                    newIngredients[index] = text;
                    // @ts-ignore
                    setIngredientsArray(newIngredients);
                  }}
                  bg="#FFF"
                  size="lg"
                  mb="5px"
                />
              ))
            }
              
            <Flex direction="row" justifyContent="space-between" alignItems="center" mb="10px">
              <Heading fontSize="16px">Instruções</Heading>
              <Button variant="ghost" onPress={addInstruction}>
                <FontAwesomeIcon icon="plus" color="#4CBE6C" size={25} />
              </Button>
            </Flex>
            {
              instructions.map((instruction, index) => (
                <Input
                  key={index}
                  placeholder={`Instrução ${index + 1}`}
                  value={instruction}
                  onChangeText={(text) => {
                    const newInstructions = [...instructions];
                    newInstructions[index] = text;
                    setInstructions(newInstructions);
                  }}
                  bg="#FFF"
                  size="lg"
                  mb="5px"
                />
              ))
            }

            <Heading fontSize="16px" mb="10px" mt="25px">
              Tempo de preparo <Text fontSize="12px" color="#535353">(em minutos)</Text>
            </Heading>
            <Input isRequired={true} placeholder="Ex.: 120 minutos" rounded="10px" bg="#FFF" mb="15px" size="lg" keyboardType="numeric" value={time} onChangeText={(text) => setTime(text)}/>
            
            <Heading fontSize="16px" mb="10px">
              Foto / Imagem da receita
            </Heading>
            <Button onPress={handleChoosePhoto} bg="#a300cc" rounded="10px" fontSize="16px">
              Selecionar Imagem
            </Button>
            {photo && (
              <Image
                source={{ uri: photo.uri }}
                alt="Imagem selecionada"
                style={{ width: 200, height: 200, alignSelf: "center", marginTop: 10 }}
                mb="25px"
              />
            )}
            
            <Heading fontSize="16px" mb="10px" mt="20px">
              Link de como fazer a receita no youtube
            </Heading>
            <Input isRequired={true} rounded="10px" bg="#FFF" mb="15px" size="lg" value={video} onChangeText={(text) => setVideo(text)}/>
            <Button onPress={() => { handleRegister(); addIngredient(); }} bg="#4CBE6C" rounded="10px" mt="25px" _pressed={{ bg: "#2a9648" }}>
              Registrar Comida
            </Button>
          </Flex>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
