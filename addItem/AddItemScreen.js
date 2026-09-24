import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { styles } from '../../styles/addItemScreenStyles';
import { useCart } from '../../context/CartContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const ADDONS = [
    { id: 'egg', name: 'ไข่ดาว', price: 1000 },
    { id: 'rice', name: 'ข้าวเพิ่ม', price: 1000 },
    { id: 'special', name: 'พิเศษ', price: 2000 },
];

export default function AddItemScreen({ food, onBack, onAdded }) {
    const { addItem } = useCart();
    const [qty, setQty] = useState(1);
    const [note, setNote] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);

    const selectedAddons = ADDONS.filter(a => selectedIds.includes(a.id));
    const addonSum = selectedAddons.reduce((s, a) => s + a.price, 0);
    const unitPrice = food.price + addonSum;
    const fmt = satang => `฿${satang / 100}`;

    const toggleAddon = id =>
        setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

    const handleAdd = () => {
        addItem(food, qty, note.trim(), selectedAddons);
        onAdded();
    };

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.backButtonText}>‹ กลับ</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>เพิ่มรายการอาหาร</Text>
                <View style={{ width: 70 }} />
            </View>

            <View style={styles.body}>
                <View style={styles.dishHead}>
                    <View style={styles.dishThumb}>
                        {food.image ? (
                            <Image source={food.image} style={styles.dishThumbImage} resizeMode="cover" />
                        ) : (
                            <Text style={styles.dishThumbText}>ไม่มีรูป</Text>
                        )}
                    </View>
                    <View>
                        <Text style={styles.dishName}>{food.food_name}</Text>
                        <Text style={styles.dishUnitPrice}>{fmt(food.price)} / รายการ</Text>
                    </View>
                </View>

                <Text style={styles.fieldLabel}>บวกเพิ่ม</Text>
                <View style={a.addonWrap}>
                    {ADDONS.map(addon => {
                        const on = selectedIds.includes(addon.id);
                        return (
                            <TouchableOpacity
                                key={addon.id}
                                style={[a.addon, on && a.addonOn]}
                                onPress={() => toggleAddon(addon.id)}
                                activeOpacity={0.8}
                            >
                                <Text style={a.box}>{on ? '☑' : '☐'}</Text>
                                <Text style={a.addonText}>
                                    {addon.name} +{addon.price / 100}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text style={styles.fieldLabel}>ความต้องการพิเศษ เช่น เผ็ดน้อย</Text>
                <TextInput
                    style={styles.noteInput}
                    placeholder="ระบุความต้องการพิเศษ (ถ้ามี)"
                    placeholderTextColor="#9CA3AF"
                    value={note}
                    onChangeText={setNote}
                    multiline
                />

                <Text style={styles.fieldLabel}>จำนวน</Text>
                <View style={styles.qtyRow}>
                    <TouchableOpacity
                        style={[styles.qtyBtn, qty <= 1 && { opacity: 0.4 }]}
                        disabled={qty <= 1}
                        onPress={() => setQty(qty - 1)}
                    >
                        <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyNum}>{qty}</Text>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty + 1)}>
                        <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>ราคารวม</Text>
                    <Text style={styles.totalValue}>{fmt(qty * unitPrice)}</Text>
                </View>
                <TouchableOpacity style={styles.primaryButton} onPress={handleAdd}>
                    <Text style={styles.primaryButtonText}>เพิ่มลงตะกร้า</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const a = StyleSheet.create({
    addonWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
    addon: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingHorizontal: 14, paddingVertical: 10,
        borderRadius: 10, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#fff',
    },
    addonOn: { borderColor: '#10B981', backgroundColor: '#ECFDF5' },
    box: { fontSize: 20 },
    addonText: { fontSize: 15 },
});