import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, StyleSheet } from 'react-native';
import { useCart, itemUnitPrice, itemTotal } from '../../context/CartContext';
import { colors } from '../../styles/theme';

const fmt = satang => `${(satang / 100).toFixed(2)} บาท`;

export default function CartScreen({ onBack, onGoSummary }) {
    const { cart, sealedRounds, setItemQty, removeItem, placeOrder, roundSubtotal } = useCart();
    const [removeIndex, setRemoveIndex] = useState(null);

    const handleMinus = (it, i) => {
        if (it.qty > 1) setItemQty({ scope: 'current' }, i, it.qty - 1);
        else setRemoveIndex(i);
    };

    const confirmRemove = yes => {
        if (yes && removeIndex !== null) removeItem({ scope: 'current' }, removeIndex);
        setRemoveIndex(null);
    };

    const handlePlaceOrder = async () => {
        try {
            await placeOrder(); // ตะกร้าว่างทันที
        } catch (e) {
            console.error('Place order error:', e);
        }
    };

    const hasAnything = cart.length > 0 || sealedRounds.length > 0;

    return (
        <View style={s.root}>
            <View style={s.header}>
                <Text style={s.headerTitle}>ตะกร้า</Text>
                <TouchableOpacity style={s.backBtn} onPress={onBack}>
                    <Text style={s.backText}>กลับ</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={s.content}>
                {cart.length === 0 && <Text style={s.empty}>ตะกร้าว่าง</Text>}
                {cart.map((it, i) => (
                    <View key={it.key} style={s.card}>
                        <View style={{ flex: 1 }}>
                            <Text style={s.itemName}>{it.food.food_name}</Text>
                            {(it.addons || []).length > 0 && (
                                <Text style={s.note}>
                                    {it.addons.map(a => `+${a.name} (${a.price / 100})`).join('  ')}
                                </Text>
                            )}
                            {it.note ? <Text style={s.note}>หมายเหตุ: {it.note}</Text> : null}
                            <Text style={s.itemText}>{fmt(itemUnitPrice(it))} x {it.qty} = {fmt(itemTotal(it))}</Text>
                        </View>
                        <TouchableOpacity style={s.qtyBtn} onPress={() => handleMinus(it, i)}>
                            <Text style={s.qtyText}>−</Text>
                        </TouchableOpacity>
                        <Text style={s.qtyNum}>{it.qty}</Text>
                        <TouchableOpacity
                            style={s.qtyBtn}
                            onPress={() => setItemQty({ scope: 'current' }, i, it.qty + 1)}
                        >
                            <Text style={s.qtyText}>+</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <View style={s.footer}>
                {cart.length > 0 && (
                    <Text style={s.total}>รวมตะกร้านี้ {fmt(roundSubtotal(cart))}</Text>
                )}
                <View style={s.footerRow}>
                    <TouchableOpacity style={[s.btn, s.btnLight]} onPress={onBack}>
                        <Text style={[s.btnText, { color: colors.primary }]}>กลับไปเลือกอาหาร</Text>
                    </TouchableOpacity>
                    {cart.length > 0 && (
                        <TouchableOpacity style={[s.btn, s.btnOrder]} onPress={handlePlaceOrder}>
                            <Text style={s.btnText}>สั่งอาหาร</Text>
                        </TouchableOpacity>
                    )}
                    {hasAnything && (
                        <TouchableOpacity style={[s.btn, s.btnPay]} onPress={onGoSummary}>
                            <Text style={s.btnText}>สรุปยอด / ชำระเงิน</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <Modal visible={removeIndex !== null} transparent animationType="fade">
                <View style={s.overlay}>
                    <View style={s.modalCard}>
                        <Text style={s.modalText}>ต้องการลบสินค้าออกจากรายการใช่หรือไม่?</Text>
                        <View style={s.footerRow}>
                            <TouchableOpacity style={[s.btn, s.btnGray]} onPress={() => confirmRemove(false)}>
                                <Text style={[s.btnText, { color: '#111' }]}>ไม่ใช่</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[s.btn, s.btnDanger]} onPress={() => confirmRemove(true)}>
                                <Text style={s.btnText}>ใช่</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const s = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#F3F4F6' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: colors.primary },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
    backBtn: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
    backText: { fontWeight: '600', color: colors.primary },
    content: { padding: 16, gap: 12 },
    empty: { textAlign: 'center', color: '#6B7280', marginTop: 40, fontSize: 16 },
    card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
    itemName: { fontSize: 15, fontWeight: '600' },
    itemText: { fontSize: 14 },
    note: { color: '#6B7280', fontSize: 13 },
    qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
    qtyText: { fontSize: 18, fontWeight: '700' },
    qtyNum: { minWidth: 24, textAlign: 'center', fontSize: 16 },
    footer: { padding: 16, backgroundColor: '#fff', gap: 10 },
    total: { fontSize: 18, fontWeight: '700' },
    footerRow: { flexDirection: 'row', gap: 12 },
    btn: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', backgroundColor: colors.primary },
    btnLight: { backgroundColor: '#EFF6FF' },
    btnOrder: { backgroundColor: '#F59E0B' },
    btnPay: { backgroundColor: '#10B981' },
    btnGray: { backgroundColor: '#E5E7EB' },
    btnDanger: { backgroundColor: '#EF4444' },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
    modalCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '60%', gap: 16 },
    modalText: { fontSize: 16, textAlign: 'center' },
});