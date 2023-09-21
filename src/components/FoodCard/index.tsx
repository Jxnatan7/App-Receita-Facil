import { ImageBackground } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import {
    Button,
    Flex,
    Heading, 
    Text
} from "native-base";

import { LinearGradient } from 'expo-linear-gradient';

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

interface ItemProps {
    item: FoodCardProps;
}

interface DataProps {
    data: ItemProps;
}

export default function FoodCard ({ data }: DataProps) {

    const formattedIngredients = (data.item.ingredients).split(",");
    const ingredientsAmount = formattedIngredients.length;

    const foodImage = `data:image/png;base64,${data.item.cover}`;

    const navigation = useNavigation();

    const handleNavigate = () => {
        // @ts-ignore
        navigation.navigate("FoodDetails", { 
            data: data.item, 
            formattedIngredients, 
            ingredientsAmount,
            foodImage
        });
    };

    return (
        <ImageBackground source={{ uri: foodImage }} borderRadius={20} style={{ marginBottom: 20 }}>
            <Button variant="ghost" w="356px" h="172px" zIndex={99} onPress={handleNavigate}>
                <Flex w="356px" h="172px" justifyContent="flex-end" alignItems="flex-start" pl="20px" pb="10px">
                    <Flex>
                        <Heading fontSize="18px" color="#FFF">
                            {data.item.name}
                        </Heading>
                        <Text fontSize="14px" color="#FFF">
                            { ingredientsAmount } { ingredientsAmount > 1 ? "ingredientes" : "ingrediente" }  | { data.item.time } min
                        </Text>
                    </Flex>
                </Flex>
            </Button>
            <LinearGradient colors={["transparent", "rgba(0, 0, 0, 0.70)", "rgba(0, 0, 0, 0.95)"]} style={{ borderRadius: 20, position: "absolute", left: 0, bottom: 0, right: 0, height: "55%", zIndex: 1 }}/>
        </ImageBackground>
    )
}