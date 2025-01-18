import React, { useState, useEffect } from "react";
import { CFormSelect, CFormFeedback } from "@coreui/react";
import Select from "react-select";

const DropdownMapper = ({
  id,
  label,
  name,
  value,
  invalid,
  register,
  onChange,
  category,
  inventory,
  reteId
}) => {


  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Process inventory to create dropdown options
    // console.log(reteId, "reteId")

    if(reteId && category === "5"){
      // console.log(reteId, category, "Category value")

      const filteredInventory = inventory.filter(item => item.rate_id === reteId);
      const processedOptions = filteredInventory.map((item) => ({
        inventory_id: item.inventory_id,
        label: `${item.course_inv_startdate} (Start: ${item.course_startime}, End: ${item.course_endtime})`,
      }));
      setOptions(processedOptions);
      // console.log(processedOptions, "Processed options");

    } else if(reteId && category === "3"){
      // console.log(reteId, category, "Category value")

      const filteredInventory = inventory.filter(item => item.rate_id === reteId);
      const processedOptions = filteredInventory.map((item) => ({
        inventory_id: item.inventory_id,
        label: `Pickup Location: ${item.pickup_location} (Pickup Time: ${item.pickup_time}, Date: ${item.inventory_date})`,
      }));
      setOptions(processedOptions);
      // console.log(processedOptions, "Processed options");

    } else if (category === "1" || category === "2") {
      // console.log(category, "Category value")
      const processedOptions = inventory
        .map((item) => {
          const optionLabels = [];
          for (let i = 1; i <= 5; i++) {
            const variationType = item[`variation_type${i}`];
            const variantType = item[`variant_type${i}`];
            if (variationType && variantType) {
              optionLabels.push(`${variationType} (${variantType})`);
            }
          }
          return {
            inventory_id: item.inventory_id,
            label: optionLabels.join(" "),
          };
        })
        // Filter out options with empty labels
        .filter((option) => option.label.trim() !== "");

      setOptions(processedOptions);
      // console.log(processedOptions, "Processed options");

    }else if (category === "3"){
      // console.log(category, "Category value")
      const processedOptions = inventory.map((item) => ({
        inventory_id: item.inventory_id,
        label: `Pickup Location: ${item.pickup_location} (Pickup Time: ${item.pickup_time}, Date: ${item.inventory_date})`,
      }));
      setOptions(processedOptions);
      // console.log(processedOptions, "Processed options");

    } else if (category === "5") {

      // console.log(category, "Category value")
      const processedOptions = inventory.map((item) => ({
        inventory_id: item.inventory_id,
        label: `${item.course_inv_startdate} (Start: ${item.course_startime}, End: ${item.course_endtime})`,
      }));
      setOptions(processedOptions);
      // console.log(processedOptions, "Processed options");
    }

  }, [inventory,reteId]);

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
              disabled={options.length === 0} // Disable if no options
            >
              <option value="">Select an option</option>
              {options.map((option) => (
                <option key={option.inventory_id} value={option.inventory_id}>
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
                value: option.inventory_id,
                label: option.label,
              }))}
              value={options.find((option) => option.inventory_id === value)}
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

            {/* <Select
        options={options}
        value={options.find((option) => option.inventory_id === value)}
        onChange={onChange}
        placeholder="Select an option"
      />
      {invalid && <span className="text-danger">This field is required.</span>} */}
          </>
        )
      }

    </>
  );
};

export default DropdownMapper;




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
