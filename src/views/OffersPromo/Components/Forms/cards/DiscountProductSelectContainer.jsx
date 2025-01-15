import React, { useState, useRef, useEffect } from "react";
import { CFormFeedback, CFormInput,CSpinner } from "@coreui/react";
import "./CustomSelect.css"; // Add your custom styles here
import ProductSelectListCard from "./ComponentCards/ProductSelectListCard";


const DiscountProductSelectContainer = ({
  id,
  label,
  name,
  value,
  invalid,
  options = [{ value: "TEstttt123", name: "Test1" }, { value: "TEstttt3321", name: "Test" }],
  placeholder = "Select an option",
  onChange,
  products,
  // register,
  category,
  load
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(value || "");
  const dropdownRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleSelect = (optionValue) => {
    console.log(optionValue.product_id, "optionValue")
    setSelectedProduct(optionValue.product_name)
    setSelectedOption(optionValue.product_id);
    setIsOpen(false);
    onChange({ target: { name, value: optionValue } }); // Mimic event object for onChange handler

  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // React.useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const [searchTerm, setSearchTerm] = useState("")

  const handleDataChange = (e) => {
    setIsOpen(true)
    console.log(e.target.value, "target value")
    setSearchTerm(e.target.value)
  }


  // useEffect(() => {
  //   if (searchTerm) {

  //     setFilteredProducts(filteredProducts)
  //   } else {
  //     setFilteredProducts(products)
  //   }

  // }
  //   , [searchTerm])


  const [productDataList,setProductDataList] = useState([])




  useEffect(() => {
    setSelectedProduct(null)
    if(products?.length > 0){
      const filteredProducts = products?.filter((product) => {
        return product?.product_name?.toLowerCase().includes(searchTerm?.toLowerCase())
      })
  
      setProductDataList(filteredProducts)
      setSelectedProduct(null)
    }

  }, [products,category, searchTerm]);



  return (
    <div className="custom-select-container" ref={dropdownRef}>
      {label && <label htmlFor={id}>{label}</label>}
      <div
        className={`custom-select ${invalid ? "is-invalid" : ""}`}
        onClick={toggleDropdown}
      >
          <span style={{padding:"1%"}} className="custom-select-arrow">▼</span>
        {/* <CFormInput className="custom-select-value" value={selectedProduct} onChange={handleDataChange} ></CFormInput> */}
           { load ? <div className="d-flex justify-content-center"><CSpinner /></div> : 
                <CFormInput className="custom-select-value" value={selectedProduct} onChange={handleDataChange}  ></CFormInput>}

      
      </div>
      {isOpen && (
        <div className="custom-select-dropdown">
          {productDataList.map((option) => (

            <div
              key={option.product_id}
              className={`custom-select-option ${selectedOption === option.product_id ? "selected" : ""
                }`}
              onClick={() => handleSelect(option)}
            >
              <ProductSelectListCard details={option}></ProductSelectListCard>

            </div>
          ))}
        </div>
      )}
      {invalid && <CFormFeedback invalid>This field is required.</CFormFeedback>}
    </div>
  );
};

export default DiscountProductSelectContainer;
