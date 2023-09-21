import { useNavigation, CommonActions } from '@react-navigation/native';

import { ImageBackground } from 'react-native';

import { Button, FlatList, Flex, Heading, ScrollView, Text, Modal } from 'native-base';
import { SafeAreaView } from 'react-native';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { FormateStrings } from "../../services/formateStrings";
import { useEffect, useState } from 'react';
import api from '../../services/api';

interface IngredientItemProps {
  data: {
    item: {
      alimento: string;
      quantidade: number;
      unidade: string;
    }
  }
}

const IngredientItem = ({ data }: IngredientItemProps) => {
  return (
    <Flex w="356px" h="52px" mb="15px" bg="#FFF" direction="row" justifyContent="space-around" alignItems="center" rounded="10">
      <Heading fontSize="16px">
        { data.item.alimento }
      </Heading>
      <Text fontSize="14px">
        {`${data.item.quantidade}${data.item.unidade}`}
      </Text>
    </Flex>
  )
}


interface InstructionItemProps {
  data: {
    index: number;
    item: string;
  }
}

const InstructionItem = ({ data }: InstructionItemProps) => {
  return (
    <Flex w="356px" h="52px" mb="10px" direction="row" alignItems="center" px="10px">
      <Heading fontSize="18px" pr="10px">
        { data.index + 1 }-
      </Heading>
      <Text fontSize="14px" maxW="300px">
        { data.item }
      </Text>
    </Flex>
  )
}

interface FoodCardProps {
  name: string;
  id: number;
  cover: string;
  favorite: boolean;
  ingredients: string;
  instructions: string;
  time: number;
  video: string;
}

interface dataProps {
  data: FoodCardProps;
  formattedIngredients: [""];
  ingredientsAmount: number;
  formattedInstructions: [""];
  foodImage: string;
}

interface paramsProps {
  params: dataProps;
}

interface FoodDetailsProps {
  route: paramsProps
}

export default function FoodDetails({ route }: FoodDetailsProps) {

    const [modalVisible, setModalVisible] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    const { cover, favorite, id, instructions, ingredients, name, time, video } = route.params.data;
    const foodImage = route.params.foodImage;
    const formattedIngredients = route.params.formattedIngredients;
    const ingredientsAmount = route.params.ingredientsAmount;
    const formattedInstructions = instructions.split(",");

    const ingredientsData = new FormateStrings().formateIngredients(formattedIngredients);
    const instructionsData = new FormateStrings().formateInstructions(formattedInstructions);

    const navigation = useNavigation();

    const handleBackPage = () => {
      navigation.dispatch(CommonActions.goBack());
    }

    const handleOpenModal = () => {
      setModalVisible(!modalVisible);
    }

    async function handleFavoriteFood() {

      if(favorite !== true) {
        try {
          await api.put("/foods", {
            id: id,
            favorite: true,
            name,
            cover,
            ingredients: ingredients,
            instructions: instructions,
            time,
            video
          })
          setIsFavorite(true);
        } catch (error) {
          console.log(`Erro ao favoritar comida, ${error}`)
        }
      } else {
        try {
          await api.put("/foods", {
            id: id,
            favorite: false,
            name,
            cover,
            ingredients: ingredients,
            instructions: instructions,
            time,
            video
          })
          setIsFavorite(false);
        } catch (error) {
          console.log(`Erro ao favoritar comida, ${error}`)
        }
      }
    }

    async function handleDelete() {
      try {
        await api.delete(`/foods/${id}`)
        // @ts-ignore
        navigation.navigate("Home");
      } catch (error) {
        console.log(`Erro ao deletar, ${error}`);
      }
    }

    return (
        <SafeAreaView>
            <Flex w="100%" bg="#FFF" pt="30px" pb="10px" px="20px" direction="row" justifyContent="space-between" alignItems="center">
              <Flex direction="row" alignItems="center">
                <Button variant="ghost" onPress={handleBackPage}>
                  <FontAwesomeIcon icon="arrow-left" color="#000" size={20}/>
                </Button>
                <Heading ml="20px" fontSize="16px">
                  { name }
                </Heading>
              </Flex>
              <Button variant="ghost" onPress={handleFavoriteFood}>
                <FontAwesomeIcon icon="heart" color={isFavorite || favorite ? "#FF4141" : "#CECECE"} size={25}/>
              </Button>
            </Flex>
            <ScrollView showsVerticalScrollIndicator={false} bg="#F3F9FF">
              <Flex mt="15px" px="20px" w="100%" pb="100px">
                <Flex direction="row" justifyContent="center">
                  <ImageBackground source={{ uri: foodImage }} borderRadius={20}>
                    <Button variant="ghost" w="356px" h="172px" zIndex={99}>
                        <Flex justifyContent="center" alignItems="center">
                            <FontAwesomeIcon icon="play-circle" size={50} color="#FFF"/>
                        </Flex>
                    </Button>
                  </ImageBackground>
                </Flex>
                <Flex mt="15px">
                  <Heading fontSize="18px">
                    { name }
                  </Heading>
                  <Text fontSize="18px" mb="15px">
                    ingredientes ({ ingredientsAmount })
                  </Text>
                </Flex>
                <Flex justifyContent="center" alignItems="center">
                  <FlatList
                    data={ingredientsData}
                    keyExtractor={(item, id) => `${id}`}
                    // @ts-ignore
                    renderItem={item => <IngredientItem data={item}/>}
                  />
                </Flex>
                <Flex direction="column" alignItems="center">
                  <Flex w="356px" h="36px" mb="15px" bg="#4CBE6C" rounded="10px" direction="row" justifyContent="flex-start" alignItems="center" pl="10px">
                    <Heading fontSize="18px" color="#FFF">
                      Modo de preparo
                    </Heading>
                  </Flex>
                  <FlatList
                    data={instructionsData}
                    keyExtractor={(item, id) => `${id}`}
                    renderItem={(item) => <InstructionItem data={item}/>}
                  />
                </Flex>
                <Flex>
                  <Button bg="#ff0040" mt="100px" onPress={handleOpenModal}>
                    <FontAwesomeIcon icon="trash" color="#FFF"/>
                  </Button>
                </Flex>
              </Flex>
            </ScrollView>
            <Modal
              isOpen={modalVisible}
              onClose={setModalVisible}
              size="md"
            >
              <Modal.Content>
                <Modal.CloseButton/>
                <Modal.Header pt="50px">
                  Tem certeza que deseja deletar esta receita?
                </Modal.Header>
                <Modal.Body>
                  <Flex>
                    <Button bg="#390083" onPress={handleDelete}>
                      <Text fontWeight="bold" color="#FFF">Tenho certeza</Text>
                    </Button>
                  </Flex>
                </Modal.Body>
              </Modal.Content>
            </Modal>
        </SafeAreaView>
    );
}