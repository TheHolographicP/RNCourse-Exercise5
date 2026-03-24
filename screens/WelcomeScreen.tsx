import { StyleSheet, Text, View } from 'react-native';
import { useContext, useEffect, useState} from 'react';
import axios from 'axios';
import { AuthContext } from 'store/auth-context';


export function WelcomeScreen() {
  const [message, setMessage] = useState('');
  const authContext = useContext(AuthContext);
  const token = authContext.token;
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `https://react-native-course-7fe21-default-rtdb.firebaseio.com/message.json?auth=${token}`);
        console.log('Fetched data:', response.data);
        setMessage(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [token]);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome!</Text>
      <Text>{message}</Text>
      <Text>You authenticated successfully!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
