class FormateStrings {
    public formateIngredients(array: string[]){
        const ingredientsData = array.map((item) => {
            const match = item.match(/(\D+) (\d+)(\D*)/);
      
            if (match) {
              const [_, alimento, quantidade, unidade] = match;
              return { alimento, quantidade: parseInt(quantidade), unidade };
            } else {
              // Se não houver correspondência, você pode lidar com isso de acordo com sua lógica
              return { alimento: item, quantidade: null, unidade: null };
            }
        });

        return ingredientsData;
    }

    public formateInstructions(array: string[]){
        const instructionsData = array.map((item) => {
            return item;
        });

        return instructionsData;
    }
}


export {FormateStrings};