import React, { useEffect, useState, useCallback } from "react";

import {RefreshControl} from "react-native";

import { 
    Box,
    Button,
    Flex,
    Image,
    Text,
    StatusBar,
    Heading,
    Input,
    ScrollView,
    FlatList
} from "native-base";

import FoodCard from '../../components/FoodCard';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { SafeAreaView } from 'react-native';

import api from "../../services/api";

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

export default function HomeScreen({route}) {

    const fetch = route.params.fetch;

    const [refreshing, setRefreshing] = useState(false);
    const [foods, setFoods] = useState([]);

    async function fetchApi() {
        try {
          const response = await api.get("/foods");
          setFoods(response.data);
        } catch (error) {
          console.error("Erro na solicitação:", error);
        }
    }

    const onRefresh = () => {
        setRefreshing(true)
    };

    useEffect(() => {    
        setRefreshing(false);
        fetchApi();
    }, [refreshing])

    return (
        <SafeAreaView>
            <StatusBar barStyle="dark-content"/>
            <Flex direction="column" w="100%" h="auto" px="20px">
                <Flex w="173px" h="36px"  mt="20px" bg="#4CBE6C" justifyContent="center" alignItems="center" roundedTopLeft="10px" roundedTopRight="10px" roundedBottomLeft="10px" roundedBottomRight="30px">
                    <Text fontSize="17px" fontWeight="700" color="#FFF">
                        Receita fácil
                    </Text>
                </Flex>
                <Heading mt="10px">
                    Encontre a receita
                </Heading>
                <Heading>
                    que combina com você
                </Heading>
                <Input mt="25px" mb="25px" w="100%" h="52px" fontSize="14px" placeholder="Digite o nome da comida" variant="rounded" InputRightElement={<FontAwesomeIcon icon="search" color="#4CBE6C" size={20} style={{ marginRight: 15 }}/>}/>
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>} h="auto" contentContainerStyle={{ paddingBottom: 500 }} showsVerticalScrollIndicator={false}>
                    <FlatList
                        data={foods}
                        keyExtractor={(item: FoodCardProps) =>  `${item.id}` }
                        renderItem={ (item) => <FoodCard data={item}/>}
                    />
                </ScrollView>
            </Flex>
        </SafeAreaView>
    );
}