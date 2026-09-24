import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { listCategories, listFoods } from '../../db/database';
import { styles } from '../../styles/foodsScreenStyles';
import { colors, topInset } from '../../styles/theme';

export default function FoodScreen({ db, onBack }) {

    const [categories, setCategories] = useState([]);
    const [foods, setFoods] = useState([]);

    const [selectedCategoryId, setSelectedCategoryId] =
        useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const categoryData =
                await listCategories(db);

            const foodData =
                await listFoods(db);

            setCategories(categoryData);
            setFoods(foodData);
        } catch (error) {
            console.error(
                'Load food data error:',
                error
            );
        }
    };

    const filteredFoods =
        selectedCategoryId === null
            ? foods
            : foods.filter(
                food =>
                    food.category_id ===
                    selectedCategoryId
            );
    const formatPrice = (price) => {
        return `${(price / 100).toFixed(2)} บาท`;
    };

    const renderFood = ({ item }) => {

        return (
            <TouchableOpacity
                style={styles.foodCard}
                activeOpacity={0.8}
                onPress={() => {
                    console.log(
                        'เลือกอาหาร:',
                        item.food_name
                    );
                }}
            >
                {item.image ? (
                    <Image
                        source={item.image}
                        style={styles.foodImage}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.foodImagePlaceholder}>
                        <Text style={styles.foodImagePlaceholderText}>
                            ไม่มีรูป
                        </Text>
                    </View>
                )}

                <View style={styles.foodInfo}>
                    <Text style={styles.foodName} numberOfLines={2}>{item.food_name}</Text>
                    <Text style={styles.foodPrice}>{formatPrice(item.price)}</Text>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <View style={styles.foodRoot}>
            <View style={[styles.foodHeader , { backgroundColor: colors.primary}]}>
                <Text style={styles.foodHeaderTitle}>
                    รายการอาหาร
                </Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBack}
                >
                    <Text style={styles.backButtonText}>
                        กลับ
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.foodContent}>
                <View style={styles.categorySidebar}>
                    <Text style={styles.categoryTitle}>
                        หมวดอาหาร
                    </Text>
                    <TouchableOpacity
                        style={[ styles.categoryButton, selectedCategoryId === null && styles.categoryButtonActive ]}
                        onPress={() =>
                            setSelectedCategoryId(null)
                        }
                    >
                        <Text style={[ styles.categoryText, selectedCategoryId === null && styles.categoryTextActive ]}>
                            ทั้งหมด
                        </Text>

                    </TouchableOpacity>

                    {categories.map(category => (
                        <TouchableOpacity
                            key={category.category_id}
                            style={[ styles.categoryButton, selectedCategoryId === category.category_id && styles.categoryButtonActive ]}
                            onPress={() =>
                                setSelectedCategoryId(
                                    category.category_id
                                )
                            }
                        >
                            <Text style={[ styles.categoryText, selectedCategoryId === category.category_id && styles.categoryTextActive ]}>
                                {category.category_name}
                           </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={styles.foodListContainer}>
                    <Text style={styles.foodListTitle}>
                        {selectedCategoryId === null
                            ? 'อาหารทั้งหมด'
                            : categories.find(
                                category =>
                                    category.category_id ===
                                    selectedCategoryId
                            )?.category_name
                        }

                    </Text>

                    <FlatList
                        data={filteredFoods}
                        keyExtractor={item => String(item.food_id)}
                        renderItem={renderFood}
                        numColumns={4}
                        columnWrapperStyle={styles.foodRow}
                        contentContainerStyle={styles.foodList}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </View>
    );
}