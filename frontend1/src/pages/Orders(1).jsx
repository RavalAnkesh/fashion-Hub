import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBagIcon, Cog6ToothIcon, TruckIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/solid'

const Orders = () => {

  const { backendUrl, token , currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [trackingIndex, setTrackingIndex] = useState(null);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            allOrdersItem.push(item);
          })
        })
        setOrderData(allOrdersItem.reverse());
      }

    } catch (error) {
      console.error("Failed to load orders", error);
    }
  }

  useEffect(() => {
    loadOrderData();
  }, [token]);

  const getTrackingStages = (status) => {
    const stages = [
      { name: "Order Placed", icon: <ShoppingBagIcon className='w-5 h-5' /> },
      { name: "Processed", icon: <Cog6ToothIcon className='w-5 h-5' /> },
      { name: "Shipped", icon: <TruckIcon className='w-5 h-5' /> },
      { name: "Out for Delivery", icon: <MapPinIcon className='w-5 h-5' /> },
      { name: "Delivered", icon: <CheckCircleIcon className='w-5 h-5' /> },
    ];
    const statusIndex = stages.findIndex(s => s.name === status);
    const validIndex = statusIndex >= 0 ? statusIndex : stages.length - 1;
    return stages.map((stage, index) => ({
      ...stage,
      completed: index <= validIndex
    }));
  };

  return (
    <div className='border-t pt-16'>

      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {
          orderData.map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col gap-4'>

              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex items-start gap-6 text-sm'>
                  <img className='w-16 sm:w-20 rounded-md border' src={item.image[0]} alt="" />
                  <div>
                    <p className='sm:text-base font-semibold'>{item.name}</p>
                    <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                      <p>{currency}{item.price}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Size: {item.size}</p>
                    </div>
                    <p className='mt-1'>Date: <span className=' text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                    <p className='mt-1'>Payment: <span className=' text-gray-400'>{item.paymentMethod}</span></p>
                  </div>
                </div>

                <div className='md:w-1/2 flex justify-between'>
                  <div className='flex items-center gap-2'>
                    <p className={`min-w-2 h-2 rounded-full ${item.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'}`}></p>
                    <p className='text-sm md:text-base'>{item.status}</p>
                  </div>
                  <button
                    onClick={() => setTrackingIndex(index === trackingIndex ? null : index)}
                    className='border px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition'
                  >
                    {index === trackingIndex ? "Hide" : "Track Order"}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {trackingIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 text-sm text-gray-600 bg-gray-50 p-4 rounded shadow"
                  >
                    <p className='font-semibold mb-4'>Tracking Progress:</p>

                    {/* Horizontal Timeline */}
                    <div className="flex justify-between items-center relative mt-8">

                      {getTrackingStages(item.status).map((stage, i) => (
                        <div key={i} className="flex flex-col items-center w-1/5 relative">
                          <div className={`w-10 h-10 rounded-full flex justify-center items-center mb-2 z-10 
                            ${stage.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                            {stage.icon}
                          </div>
                          <p className={`text-xs text-center ${stage.completed ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            {stage.name}
                          </p>
                          {/* progress line */}
                          {i < getTrackingStages(item.status).length - 1 && (
                            <div className={`absolute top-5 left-1/2 w-full h-1 ${stage.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                          )}
                        </div>
                      ))}

                      {/* Full progress line background */}
                      <div className="absolute top-5 left-5 right-5 h-1 bg-gray-300 -z-10 rounded" />
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders;
