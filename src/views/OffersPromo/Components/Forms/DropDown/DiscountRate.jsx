import React, { useState, useEffect } from "react";
import { CFormSelect, CFormFeedback } from "@coreui/react";
import Select from "react-select";

const RateSelectMapper = ({
    id,
    label,
    name,
    value,
    invalid,
    register,
    onChange,
    category,
    rate,
    inventoryId
}) => {


    const [options, setOptions] = useState([]);

    useEffect(() => {
        // Process inventory to create dropdown optio,ns
        console.log(rate,category, "Name and value 888888")

        if (inventoryId && rate) {
            if (category === "1" || category === "2") {
                // console.log(category, "Category value")

                const filteredOptions = rate.filter(item => item.inventory_id.toString() === inventoryId);
                const processedOptions = filteredOptions.map((item) => ({
                    discounted_rate_id: item.rate_id,
                    label: `Currency: ${item.currency} MRP: ${item.mrp}, Purchase price: ${item.purchase_price}`,
                }));
                setOptions(processedOptions);
                // console.log(processedOptions,inventoryId, "Processed options");

            } 
        }else if(rate && category === "1" || category === "2"){
            // console.log("Name and value 888888")
            const processedOptions = rate.map((item) => ({
                discounted_rate_id:  [item.rate_id, item.inventory_id],
                label: `Currency: ${item.currency} MRP: ${item.mrp}, Purchase price: ${item.purchase_price}`,
            }));
            setOptions(processedOptions);
            // console.log(processedOptions,inventoryId, "Processed options");
        }else if(rate && category === "4"){
            const processedOptions = rate.map((item) => ({
                discounted_rate_id:  item.rate_id,
                 label: `Meal: ${item.meal_plan} Room Type: ${item.room_type_id}, Room Category: ${item.room_category_id}`,
            }));
            setOptions(processedOptions);
            // console.log(processedOptions,inventoryId, "Processed options"); 

        }else if(rate && category === "3"){
            const processedOptions = rate.map((item) => ({
                discounted_rate_id:  item.rate_id,
                 label: `Id: ${item.rate_id} Adult Rate: ${item.adult_rate} Child Rate: ${item.child_rate} Package Rate: ${item.package_rate}`,
            }));
            setOptions(processedOptions);
            // console.log(processedOptions,inventoryId, "Processed options"); 
        }else if(rate && category === "5"){
            const processedOptions = rate.map((item) => ({
                discounted_rate_id:  item.rate_id,
                label: `Id: ${item.rate_id} Adult Rate: ${item.adult_course_fee} Child Rate: ${item.child_course_fee}`,
            }));
            setOptions(processedOptions);
            // console.log(processedOptions,inventoryId, "Processed options"); 
        }



    }, [rate,inventoryId]);

    return (
        <>
            {
                category === "1" || category === "2" ? (
                    <>
                        {label && <label htmlFor={id}>{label}</label>}
                        <CFormSelect
                            id={id}
                            name={name}
                            value={value}
                            invalid={invalid}
                            {...register}
                            onChange={onChange}
                            // disabled={options.length === 0} // Disable if no options
                        >
                            <option value="">Select an option</option>
                            {options.map((option) => (
                                <option key={option.discounted_rate_id} value={option.discounted_rate_id}>
                                    {option.label}
                                </option>
                            ))}
                        </CFormSelect>
                        {invalid && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                    </>

                ) : (
                    <>
                        {label && <label htmlFor={id}>{label}</label>}
                        <Select
                            id={id}
                            options={options.map((option) => ({
                                value: option.discounted_rate_id,
                                label: option.label,
                            }))}
                            value={options.find((option) => option.discounted_rate_id === value)}
                            onChange={(selectedOption) =>
                                onChange({
                                    name,
                                    value: selectedOption ? selectedOption.value : "",
                                })
                            }
                            placeholder="Select an option"
                            isClearable
                        />
                        {invalid && (
                            <CFormFeedback invalid>This field is required.</CFormFeedback>
                        )}
                    </>
                )
            }

        </>
    );
};

export default RateSelectMapper;




// import React, { useState, useEffect } from "react";
// import { CFormSelect, CFormFeedback } from "@coreui/react";

// const DropdownMapper = ({
//   id,
//   label,
//   name,
//   value,
//   invalid,
//   register,
//   onChange,
//   category,
//   inventory,
// }) => {
//   const [options, setOptions] = useState([]);

//   useEffect(() => {
//     // Process inventory to create dropdown options
//     console.log(category, "Category value")
//     const processedOptions = inventory
//       .map((item) => {
//         const optionLabels = [];
//         for (let i = 1; i <= 5; i++) {
//           const variationType = item[`variation_type${i}`];
//           const variantType = item[`variant_type${i}`];
//           if (variationType && variantType) {
//             optionLabels.push(`${variationType} (${variantType})`);
//           }
//         }
//         return {
//           inventory_id: item.inventory_id,
//           label: optionLabels.join(" "),
//         };
//       })
//       // Filter out options with empty labels
//       .filter((option) => option.label.trim() !== "");

//     setOptions(processedOptions);
//     console.log(processedOptions, "Processed options");
//   }, [inventory]);

//   return (
//     <>
//       {label && <label htmlFor={id}>{label}</label>}
//       <CFormSelect
//         id={id}
//         name={name}
//         value={value}
//         invalid={invalid}
//         {...register}
//         onChange={onChange}
//         disabled={options.length === 0} // Disable if no options
//       >
//         <option value="">Select an option</option>
//         {options.map((option) => (
//           <option key={option.inventory_id} value={option.inventory_id}>
//             {option.label}
//           </option>
//         ))}
//       </CFormSelect>
//       {invalid && <CFormFeedback invalid>This field is required.</CFormFeedback>}
//     </>
//   );
// };

// export default DropdownMapper;





// import React, { useState, useEffect } from "react";
// import { CFormSelect, CFormFeedback } from "@coreui/react";

// const DropdownMapper = ({
//   id,
//   label,
//   name,
//   value,
//   invalid,
//   register,
//   onChange,
//   inventory,
// }) => {
//   const [options, setOptions] = useState([]);

//   useEffect(() => {
//     // Process inventory to create dropdown options
//     const processedOptions = inventory.map((item) => {
//       const optionLabels = [];
//       for (let i = 1; i <= 5; i++) {
//         const variationType = item[`variation_type${i}`];
//         const variantType = item[`variant_type${i}`];
//         if (variationType && variantType) {
//           optionLabels.push(`${variationType} (${variantType})`);
//         }
//       }
//       return {
//         inventory_id: item.inventory_id,
//         label: optionLabels.join(" "),
//       };
//     });

//     setOptions(processedOptions);
//     console.log(processedOptions, "Name and value");
//   }, [inventory]);

//   return (
//     <>
//       {label && <label htmlFor={id}>{label}</label>}
//       <CFormSelect
//         id={id}
//         name={name}
//         value={value}
//         invalid={invalid}
//         {...register}
//         onChange={onChange}
//       >
//         <option value="">Select an option</option>
//         {options.map((option) => (
//           <option key={option.inventory_id} value={option.inventory_id}>
//             {option.label}
//           </option>
//         ))}
//       </CFormSelect>
//       {invalid && <CFormFeedback invalid>This field is required.</CFormFeedback>}
//     </>
//   );
// };

// export default DropdownMapper;
