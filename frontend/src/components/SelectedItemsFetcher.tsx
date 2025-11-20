'use client';
import React, {useMemo} from 'react';
import {useSearchParams} from 'next/navigation';
import {CartItem} from '@/types/cart';

interface SelectedItemsFetcherProps {
    cartItems: CartItem[];
    children: (selectedItems: CartItem[]) => React.ReactNode;
}

const SelectedItemsFetcher: React.FC<SelectedItemsFetcherProps> = ({cartItems, children}) => {
    // doc URL parameter
    const searchParams = useSearchParams();
    const selectedIdsParam = searchParams.get('selectedIds');

    const selectedItemKeys = useMemo((): string[] => {
        if(!selectedIdsParam) return[];
        return selectedIdsParam.split(',').map(id  => id.trim()).filter(id => id.length > 0);
    }, [selectedIdsParam]);

    // list sp da chon
    const selectedItems = useMemo(() => {
        if(selectedItemKeys.length === 0) return [];
        return cartItems.filter(item => {
            const itemKey = `${item.id}_${item.size!}`;
            return selectedItemKeys.includes(itemKey);
        });
    }, [cartItems, selectedItemKeys]);

    return <>{children(selectedItems)}</>;
}
export default SelectedItemsFetcher;
