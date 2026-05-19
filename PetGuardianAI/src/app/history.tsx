import { View, Text, StyleSheet, FlatList } from "react-native";
import { COLORS } from "../constants/colors";

const historyData = [
    {
        id:"1",
        title:"Vacinação",
        date:"10/05/2026"
    },
    {
        id:"2",
        title:"Consulta veterinária",
        date:"14/05/2026"
    },
    {
        id:"3",
        title:"Exame preventivo",
        date:"16/05/2026"
    }
];

export default function History() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Histórico Clínico
            </Text>

            <FlatList data={historyData} keyExtractor={(item)=>item.id} renderItem={({item})=>(
                    <View style={styles.card}>

                        <Text style={styles.cardTitle}>
                            {item.title}
                        </Text>

                        <Text style={styles.cardDate}>
                            {item.date}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        backgroundColor:COLORS.background
    },
    title:{
        fontSize:28,
        fontWeight:"bold",
        marginBottom:20
    },
    card:{
        backgroundColor:COLORS.card,
        padding:20,
        borderRadius:15,
        marginBottom:15
    },
    cardTitle:{
        fontWeight:"bold",
        fontSize:16
    },
    cardDate:{
        marginTop:8,
        color:COLORS.gray
    }
});