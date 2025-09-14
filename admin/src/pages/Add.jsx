import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [color, setColor] = useState("");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const [loadingAI, setLoadingAI] = useState(false);
  const [aiError, setAiError] = useState("");

  const toggleSize = (s) => {
    setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    setImage1(file);
    if (!file) return;

    setAiError("");
    setLoadingAI(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(`${backendUrl}/api/product/ai-classify`, formData, {
        headers: { token },
      });

      if (res.data.success) {
        const { predictedCategory, predictedSubCategory, color } = res.data;
        toast.info(`AI Suggestion: ${predictedCategory} → ${predictedSubCategory}`);
        setCategory(predictedCategory);
        setSubCategory(predictedSubCategory);
        setColor(color);
      } else {
        setAiError("AI detection failed: No suggestions available");
      }
    } catch (err) {
      console.error(err);
      setAiError("AI detection failed. Please try again.");
      toast.error("AI detection failed.");
    } finally {
      setLoadingAI(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!description) return toast.error("Description is required!");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("color", color);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setName(""); setDescription(""); setPrice("");
        setCategory(""); setSubCategory(""); setColor("");
        setImage1(false); setImage2(false); setImage3(false); setImage4(false);
        setSizes([]); setBestseller(false); setAiError("");
      } else toast.error(response.data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      {/* Image Upload */}
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[image1, image2, image3, image4].map((img, idx) => (
            <label key={idx} htmlFor={`image${idx+1}`}>
              <img
                className="w-20 h-20 object-cover"
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt=""
              />
              <input
                type="file"
                id={`image${idx+1}`}
                hidden
                onChange={idx === 0 ? handleImageSelect : (e) => {
                  if(idx===1) setImage2(e.target.files[0]);
                  if(idx===2) setImage3(e.target.files[0]);
                  if(idx===3) setImage4(e.target.files[0]);
                }}
              />
            </label>
          ))}
        </div>
        {loadingAI && <p className="text-sm text-gray-500 mt-2">Detecting category...</p>}
        {aiError && <p className="text-sm text-red-500 mt-2">{aiError}</p>}
        {color && (
          <p className="text-sm mt-1 flex items-center">
            Detected Color: 
            <span
              className="inline-block w-5 h-5 ml-2 rounded border"
              style={{ backgroundColor: color }}
            />
            <span className="ml-1">{color}</span>
          </p>
        )}
      </div>

      {/* Product Details */}
      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>
      <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          required
        />
      </div>

      {/* Category / SubCategory / Price */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product category</p>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="">Select category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Sub category</p>
          <select
            value={subCategory}
            onChange={e => setSubCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="">Select subcategory</option>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
          </select>
        </div>
        <div>
          <p className="mb-2">Product Price</p>
          <input
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="25"
            required
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((s) => (
            <div key={s} onClick={() => toggleSize(s)}>
              <p
                className={`${sizes.includes(s) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}
              >
                {s}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={() => setBestseller(prev => !prev)}
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      {/* Submit Button */}
      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
