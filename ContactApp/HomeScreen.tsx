import React, {useState, useEffect, useCallback, useLayoutEffect} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const orangeCircle = require('./orange-circle.png');

function HomeScreen(): JSX.Element {
  const navigation = useNavigation();
  const [jsonData, setJsonData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const storedData = await AsyncStorage.getItem('jsonData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setJsonData(parsedData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: 10 }}>
          <Ionicons name="search" size={24} color="#ff8c00" />
        </View>
      ),
      headerRight: () => (
        <View style={{ marginRight: 10 }}>
          <Ionicons name="add" size={30} color="#ff8c00" />
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEditContact = (item) => {
    navigation.navigate('EditContact', {value: item, onRefresh: loadData});
  };

  const renderEmptyList = (): JSX.Element => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{'No Contact'}</Text>
      </View>
    );
  };

  const renderContactList = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handleEditContact(item)}>
        <View style={styles.cardContainer}>
          <View style={styles.imageContainer}>
            <FastImage
              style={styles.profileImage}
              resizeMode={FastImage.resizeMode.cover}
              source={orangeCircle}
            />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.descContainer}>
              <Text style={styles.nameContainer}>
                {`${item.firstName} ${item.lastName}`}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.line} />
      </TouchableOpacity>
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
    setRefreshing(false);
  }, [loadData]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={jsonData}
        renderItem={renderContactList}
        bounces={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '20%',
    height: 80,
    borderRadius: 100,
    overflow: 'hidden',
    marginLeft: 15,
  },
  profileImage: {
    flex: 1,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  infoContainer: {
    width: '60%',
  },
  descContainer: {
    padding: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  cardContainer: {
    backgroundColor: 'white',
    marginBottom: 16,
    marginTop: 10,
    flexDirection: 'row',
  },
  line: {
    height: 1,
    backgroundColor: '#D3D3D3',
    width: '97%',
    marginLeft: 20,
  },
  nameContainer: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
