import React from 'react';
import Order from './_components/Order';

export default async function Page({ params }: any) {
    const { orderId } = params;
    return <Order orderId={orderId} />;
}
