import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      className="text-gray-700 cursor-pointer block group"
      to={`/product/${id}`}
    >
      {/* Image Wrapper */}
      <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={image[0]}
          alt={name}
        />
      </div>

      {/* Product Info */}
      <p className="pt-3 pb-1 text-sm truncate">{name}</p>
      <p className="text-sm font-medium">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;
