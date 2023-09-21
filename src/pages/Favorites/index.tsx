import { RefreshControl, SafeAreaView } from 'react-native';

import FoodCard from '../../components/FoodCard';

import { FlatList, Flex, Heading, ScrollView, StatusBar, Text } from "native-base";

import { useCallback, useEffect, useState } from 'react';

import api from '../../services/api';

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

export default function Favorites({route}) {

    const fetch = route.params.fetch;

    const [refreshing, setRefreshing] = useState(false);
    const [foods, setFoods] = useState([]);

    async function fetchApi() {
        try {
          const response = await api.get("/foods/favorites");
          setFoods(response.data);
          setRefreshing(false);
        } catch (error) {
          console.error("Erro na solicitação:", error);
          // Trate o erro de acordo com suas necessidades.
        }
    }

    useEffect(() => {    
        fetchApi();
    }, [fetch])

    const onRefresh = () => {
        setRefreshing(true);
    };

    useEffect(() => {
          fetchApi();
    }, [refreshing])

    return (
        <SafeAreaView>
            <StatusBar barStyle="dark-content"/>
            <Flex direction="column" w="100%" h="auto" px="20px">
                <Heading mt="40px" mb="30px">
                    Receitas favoritas
                </Heading>
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>} h="auto" contentContainerStyle={{ paddingBottom: 200 }} showsVerticalScrollIndicator={false}>
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