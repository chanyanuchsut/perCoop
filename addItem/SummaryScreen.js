import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useCart, itemUnitPrice, itemTotal } from '../../context/CartContext';
import { colors } from '../../styles/theme';

const fmt = satang => `${(satang / 100).toFixed(2)} บาท`;

function Round({ title, items, subtotal }) {
    return (
        <View style={s.card}>
            <Text style={s.roundTitle}>{title}</Text>
            {items.map((it, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                    <Text style={s.itemName}>{it.food.food_name} x{it.qty}</Text>
                    {(it.addons || []).length > 0 && (
                        <Text style={s.note}>
                            {it.addons.map(a => `+${a.name} (${a.price / 100})`).join('  ')}
                        </Text>
                    )}
                    {it.note ? <Text style={s.note}>หมายเหตุ: {it.note}</Text> : null}
                    <Text style={s.itemText}>{fmt(itemUnitPrice(it))} x {it.qty} = {fmt(itemTotal(it))}</Text>
                </View>
            ))}
            <Text style={s.subtotal}>รวม {fmt(subtotal)}</Text>
        </View>
    );
}

export default function SummaryScreen({ onBack, onOrderMore, onPaid }) {
    const { cart, sealedRounds, payNow, grandTotal, roundSubtotal } = useCart();

    const handlePay = async () => {
        try {
            const total = await payNow();
            if (total > 0) onPaid(); // ชำระแล้วกลับหน้ารายการอาหาร
        } catch (e) {
            console.error('Pay error:', e);
        }
    };

    return (
        <View style={s.root}>
            <View style={s.header}>
                <Text style={s.headerTitle}>สรุปยอด</Text>
                <TouchableOpacity style={s.backBtn} onPress={onBack}>
                    <Text style={s.backText}>กลับ</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={s.content}>
                {sealedRounds.map(r => (
                    <Round
                        key={r.id}
                        title={`รอบที่ ${r.roundNumber} (สั่งแล้ว)`}
                        items={r.items}
                        subtotal={roundSubtotal(r.items)}
                    />
                ))}
                {cart.length > 0 && (
                    <Round title="ยังไม่ได้กดสั่ง" items={cart} subtotal={roundSubtotal(cart)} />
                )}
                {sealedRounds.length === 0 && cart.length === 0 && (
                    <Text style={s.empty}>ยังไม่มีรายการ</Text>
                )}
            </ScrollView>

            <View style={s.footer}>
                <Text style={s.total}>ยอดรวมทุกรอบ {fmt(grandTotal)}</Text>
                <View style={s.footerRow}>
                    <TouchableOpacity style={[s.btn, s.btnMore]} onPress={onOrderMore}>
                        <Text style={s.btnText}>สั่งอาหารเพิ่ม</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[s.btn, s.btnPay, grandTotal === 0 && { opacity: 0.4 }]}
                        disabled={grandTotal === 0}
                        onPress={handlePay}
                    >
                        <Text style={s.btnText}>ชำระเงิน</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, gap: 4 },
    roundTitle: { fontWeight: '700', fontSize: 16, marginBottom: 4 },
    itemName: { fontSize: 15, fontWeight: '600' },
    itemText: { fontSize: 14 },
    note: { color: '#6B7280', fontSize: 13 },
    subtotal: { fontWeight: '700', marginTop: 4 },
    footer: { padding: 16, backgroundColor: '#fff', gap: 10 },
    total: { fontSize: 20, fontWeight: '700' },
    footerRow: { flexDirection: 'row', gap: 12 },
    btn: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
    btnMore: { backgroundColor: colors.primary },
    btnPay: { backgroundColor: '#10B981' },
    btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});