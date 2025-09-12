import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { AnimatePresence, motion } from 'framer-motion';

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const prodId in cartItems) {
        for (const size in cartItems[prodId]) {
          const qty = cartItems[prodId][size];
          if (qty > 0) {
            tempData.push({ _id: prodId, size, quantity: qty, key: `${prodId}-${size}` });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const hasItems = cartData.length > 0;

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      <div>
        <AnimatePresence>
          {cartData.map(item => {
            const productData = products.find(p => p._id === item._id);
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'
              >
                <div className='flex items-start gap-6'>
                  <img className='w-16 sm:w-20' src={productData.image[0]} alt="" />
                  <div>
                    <p className='text-xs sm:text-lg font-medium'>
                      {productData.name}
                    </p>
                    <div className='flex items-center gap-5 mt-2'>
                      <p>{currency}{productData.price}</p>
                      <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>
                        {item.size}
                      </p>
                    </div>
                  </div>
                </div>

                <input
                  onChange={e => {
                    const val = e.target.value;
                    if (val === '' || val === '0') return;
                    updateQuantity(item._id, item.size, Number(val));
                  }}
                  className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                />

                <img
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className='w-4 mr-4 sm:w-5 cursor-pointer'
                  src={assets.bin_icon}
                  alt=""
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {!hasItems && (
        <div className="text-center text-gray-500 my-20 text-lg">
          Your cart is empty 🛒
        </div>
      )}

      <div className='flex justify-end my-20'>
        <div className='w-full sm:w-[450px]'>
          <CartTotal />
          <div className='w-full text-end'>
            <button
              onClick={() => {
                if (hasItems) {
                  navigate('/place-order');
                } else {
                  navigate('/'); // or '/shop'
                }
              }}
              className={`bg-black text-white text-sm my-8 px-8 py-3 ${
                !hasItems ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!hasItems}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
