import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

const ProductSuggestionModal = ({ show, onHide, messageList, chatDetails, onMessageSelect }) => {
    const [chatError, setChatError] = useState(false);
    const [nextMessage, setNextMessage] = useState("");

    const handleAutoPopulateMessage = async () => {
        const dataSetAutoPopulate = {
            messageList: JSON.stringify(messageList),
            chatDetails: chatDetails
        };

        try {
            const response = await fetch("https://staging-gateway.aahaas.com/api/generate_auto_message", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataSetAutoPopulate)
            });

            const result = await response.json();

            if (response.ok) {
                setNextMessage(result.message);
            } else {
                setChatError(true);
            }
        } catch (error) {
            console.error("Error:", error);
            setChatError(true);
        }

        console.log(dataSetAutoPopulate, "Data Auto Populate is");
    };

    useEffect(() => {
        handleAutoPopulateMessage();
    }, [messageList]);

    const handleMessageSelect = () => {
        if (onMessageSelect) {
            onMessageSelect(nextMessage); // Pass message back to parent
        }
    };

    const dataProduct = [
        {
            "product_name": "Colombo to Kumana National Park Day Tour",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/2B9qJVz0I47kUENpjZy4B0NKeOjmEqe9hJ8sunFh.jpg"
        },
        {
            "product_name": "Wedding Photography by Charith Kodagoda",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsHo49mYoLe8rx7KoVeAkGXvkKI459Iaw58Q&s"
        },
        {
            "product_name": "3 Hours Colombo City Tour by Colombo By Jeep",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/XSFn35rl94bGOFmSlI4NTmBLlD0ci91J12LUn2Gd.jpg"
        },
        {
            "product_name": "7 Hours Colombo City Tour by Colombo By Jeep",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/iNju8M78RACUYhsHyUBgfXGw9I733ziChGNIKrnk.jpg"
        },
        {
            "product_name": "Colombo to Bentota Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/dQRAnq6tClWwTuo0ovFaUVt6Y3tpnqIPKdYDkGRL.png"
        },
        {
            "product_name": "Colombo to Dambulla Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/pL15AX63xV15wooT7QhM7IBa4Qr1ZyJ0DPhcBZ6Y.png"
        },
        {
            "product_name": "Lunch Buffet at Oakray Flower Drum",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/GIutSBE2tQsZOduPICtr6wuHqarc3V4C3U0pwEB9.jpg"
        },
        {
            "product_name": "Colombo to Galle Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/FxkTRuSvUq4pcNPn0RT3Whkj0NP5XBmnKp8OEUcR.png"
        },
        {
            "product_name": "Dinner buffet at Oakray Flower Drum",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/uojJXb920759uVT6z7zmOMTq7L46ni8tIdYvazRE.jpg"
        },
        {
            "product_name": "Standard Lunch at Shanmugas Vegetarian Restaurant",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/7H3yKOeml9WbspVBWrxFVxC2qzb2uxW8BWVycEAr.jpg"
        },
        {
            "product_name": "Standard Dinner at Shanmugas Vegetarian Restuarant",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/WwDnFFaymW0gN2SYJNJ7XjvKF44c5UyUrVNHVClN.jpg"
        },
        {
            "product_name": "Colombo to Anuradhapura Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/tnAvLlRBZQkpJDlZB54c2ua0s350rdFjnrshhulQ.png"
        },
        {
            "product_name": "Colombo to Wadduwa Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/gpsunIl0ugJdmI1ccJeoTzc8raW9arUyoo1ljEfo.png"
        },
        {
            "product_name": "Colombo to Induruwa Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/2XN43iQHaQDHzOxmKXXY2yNr2Xv0gvrRuikfbU2Q.png"
        },
        {
            "product_name": "7 Nights - Vehicle at Disposal for Round Trip - 2 Night Kandy, 2 Night Nuwara Eliya, 2 Night Galle, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/NVnMgry3mTm0Hh8LTYAH94pACBkEM9MLVCpi1u6n.jpg"
        },
        {
            "product_name": "5 Nights - vehicle at disposal for round trip 1Night Kandy,1Night Nuwara Eliya,1 Night Yala ,1Night  Bentota , 1Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/NXoWcZUfQiGUlNfhNfGfKw7CjvZkPFusAn4NyVcr.jpg"
        },
        {
            "product_name": "Colombo to Kalutara Transfers - One way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/a9a17WsSUMlZjb9sPfwycXgQWZ0LOYphjwGoH3VU.png"
        },
        {
            "product_name": "Colombo to Ahungalla Transfers - One way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/oEI4eEb2asCmyCZZtDAroWD8GS4P8KNw0JlY0VPW.png"
        },
        {
            "product_name": "Colombo to Hikkaduwa Transfers - One way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/rI8sVdydSiaDc3nOlpmkWLuL6peBw3zEMegkLr7U.png"
        },
        {
            "product_name": "Colombo to Unawatuna Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/2BSbJxLQdKCtnZyiAJgu5MVtholrqPFenWDFkof0.png"
        },
        {
            "product_name": "Colombo to Koggala Transfers - One way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/nplJxlj30odthyhBBmMQRO8JyyPeeV0uCoK7dLH2.png"
        },
        {
            "product_name": "Colombo to Weligama Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/BPXNtdZf2PgHbgtlImiqNmNyI4RmMfNumwpehzyS.png"
        },
        {
            "product_name": "Colombo to Mirissa Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/fO7UUdCnLpGFWXi6Pj9dKqv14ptJDDEZafMRn5EF.png"
        },
        {
            "product_name": "Colombo to Tangalle Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/XSv1Rd00Y1yCMym504KgIcwK6J7ROXHmxpRMUE22.png"
        },
        {
            "product_name": "Colombo to Hambantota Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/zqHQKXrqM8pvXE6sDyTidZXi4gaPrK3x49wBsFyk.png"
        },
        {
            "product_name": "Colombo to Ramboda Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/MQp63OCjmrpMT8rfPldWbPwzwWmH9kJGtxvpHzG6.png"
        },
        {
            "product_name": "Colombo to Ella Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/ExOWi70nGWEwpdAqE5s6yqR3MOzqbQPZW0KqbeuA.png"
        },
        {
            "product_name": "Colombo to Minneriya Transfers - one way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/3SDf18Ytt8beBhREN83dPNVahVikLDg4xJVfddgx.png"
        },
        {
            "product_name": "Colombo Half Day City Tour 4 Hours (Without Entrance / Meal)",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/baih6ulnl3CNID0xzyn72NGW8BqSbJhBpPpPLUuP.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/UtbDKLF0LwVdXhSPFgK7XV47jAuBCI56VPPgjzYR.png"
        },
        {
            "product_name": "9 Nights - Vehicle at Disposal for Round Trip - 1 Night Colombo, 2 Night Dambulla, 2 Night Kandy, 1 Night Nuwara Eliya, 1 Night Yala, 2 Night Bentota",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/P524fCOFLEqSpSJF0ZYGtNd5RM4oGoJeX6PhrNJa.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Idjo7GAzqKOvkaAAuwMJQFhTgLdyw6nVZby8k5qS.jpg"
        },
        {
            "product_name": "Colombo to Polonnaruwa Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/8CWLS1c98EtI1dfDvLhLSlPqJo8MAXzOU2tWaqpG.png"
        },
        {
            "product_name": "Colombo to Kataragama Transfers - One way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/b3HRx5RBvTA3G2b6YjA3WEnQ24yazZ31eF3qBenJ.png"
        },
        {
            "product_name": "Colombo Short City Tour 2 Hours (Without Entrance/Meal)",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/FEOybibK8Em5XtIFfCy36lQMZBUWQy2In5XYlcmB.png"
        },
        {
            "product_name": "Colombo to Yala Transfers - One Way",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/9hKZVXJ4IeuW5WpWTSppQ3uNcR4NUG2sXxWohplS.png"
        },
        {
            "product_name": "Colombo to Trincomale Transfers",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/31bdLadc7J0v6dUWi9C8XoincDZk4vcEhTpvSf87.png"
        },
        {
            "product_name": "4 Nights - Vehicle at Disposal for Round Trip - 1 Night Colombo, 3 Night Bentota",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/bAJNzO9btJn9gPDUEH2OoVJGO5XayGgcu9GEXCBt.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/0wqhmwlSL3GIylD9OTjNnMbkJvADyAb1AfAI15ny.jpg"
        },
        {
            "product_name": "3 Nights - Vehicle at Disposal for Round Trip - 2 Night Bentota, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/GZBNs4bgWDS5M7KlBnaLrnc616VweZxNeZRDxVMM.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/tgphdOaWYpdXNhwqTHhSFLHXRIbJkoLPTy5RwlSB.jpg"
        },
        {
            "product_name": "2 - Nights Vehicle at disposal for round trip 2Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/2eYtgyKn2hB9MX9cIpLMnA2BEbRvPS5jYGSQs7sx.jpg"
        },
        {
            "product_name": "Colombo Full Day City Tour 8 Hours (Without Entrance / Meal)",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/qRz2fwRzr9TGE1r5dMgfq5bXDaS7Y5fy5SHWB6rO.png"
        },
        {
            "product_name": "4 Nights - Vehicle at Disposal for Round Trip - 2 Night Yala, 2 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/awRcnhfQYSRkVnsadd0AZiDrc19tDyNYndGFvXEC.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Sw7azD5KMxbRlSVdNxPanzP0RFcLZo9YugudSfIP.jpg"
        },
        {
            "product_name": "5 Nights - Vehicle at Disposal for Round Trip - 1 Night Dambulla, 1 Night Trincomalee, 1 Night Kandy, 2 Night Nuwara Eliya",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/4H6cqOxjrL87myO59C6Qa1aF5RBgzmLbxGTcH9bh.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/jHTMXTasM8ayMAhJ0kvjnqDR68h9bEGwN32ENefZ.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/j9Xqj3qpaThnpR0a0uN7q0OGGGVPVayL4aZ2Sid2.jpg"
        },
        {
            "product_name": "4 Nights - Vehicle at Disposal for Round Trip - 1 Night Bentota, 2 Night Yala, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/HyKj4If8vZKOA4k25bF8joP51wWly4z6TmoxC2sj.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/O2ORWzwaWaTZmM3qWoYmMydaF5hRZGjhG0J8XFl5.jpg"
        },
        {
            "product_name": "6 Nights - Vehicle at Disposal for Round Trip - 2 Night Kandy, 2 Night Bentota, 2 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/VEMqSBj3PISzoCOzet3YCNqiVicFkUOEhbIGjqLc.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/f00MlGW8n1SMotjUwnAGhE8JJZuc40wfIWYJybxm.jpg"
        },
        {
            "product_name": "4 Nights - Vehicle at Disposal for Round Trip - 1 Night Kandy, 1 Night Nuwara Eliya, 2 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/hpEICAKjABZ8QXDriHrRCrfhL1y77Hp0Mfhy4UvI.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/oVtsbbp8KTmsadrY7HURTU3L49FckJApSQSwFRqI.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/tdcOPePq9sBLkbZlD1fqjxaGlnXqbmLmGtZtGoKu.jpg"
        },
        {
            "product_name": "3 Nights - Vehicle at Disposal for Round Trip - 1 Night Bentota, 2 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/OvevJWnGu0SrvXb2dY68jjDtjzEkQRlN0X6HLJPC.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/GhV354zJJjeG8Un2zF0IDiGDJL7VkVmvUvdgCrTV.jpg"
        },
        {
            "product_name": "5 Nights - Vehicle at Disposal for Round Trip - 1 Night Sigiriya, 1 Night Kandy, 1 Night Nuwara Eliya, 1 Night Bentota, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/1tFn8tpqlyMDbDsdBB1GznIxMa0iyLIoTEyDFCAG.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/EBDzJ6UFbNcGoMz3HwVoIRFqEi3cShrIt8K5ocDO.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/uBhEPazSy9yeRdtozNlpGtZJVSDfAfwIPvFVKB6Y.jpg"
        },
        {
            "product_name": "4 Nights - Vehicle at Disposal for Round Trip - 2 Night Kandy, 1 Night Nuwara Eliya, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/ZDquOopdmRmEzxGi5ShR8S6RcjKkK1skNLrBMM39.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/VAfEzIYfkDaJIDLMYSXmg91IDCCqxGRv7vUxQDCX.jpg"
        },
        {
            "product_name": "6 Nights - Vehicle at Disposal for Round Trip - 2 Night Kandy, 1 Night Bentota, 1 Night Galle, 2 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/MOjwBV551vyWJPpL77CWnAKFWc6qLBW4Gzr4DU6z.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/5EoDQ1FhzkdBx4YVCLXyfwfYAE3svxGdg2s8O668.jpg"
        },
        {
            "product_name": "3 Nights - Vehicle at Disposal for Round Trip - 1 Night Kandy, 1 Night Bentota, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/XF05FuqeJVJFqqCm7AQvb6b2eAut2D9tkzv2LKHQ.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/UtufeyJDRKxfKd26uaLDfLs2Zysimpx1GWehVE3V.jpg"
        },
        {
            "product_name": "6 Nights - Vehicle at Disposal for Round Trip - 1 Night Kandy, 1 Night Nuwara Eliya, 1 Night Yala , 1 Night Galle, 1 Night Bentota, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/ZoE3BVnjcaFVZTDrvzuOEPH2tIRzV33hKv4hOY9R.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/1pueoQkwZQ0bcpeJUgITdHYvRllxzR3BFhlCWm4z.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/JAF2iTTaVyjVcRyjZcgaQOmy8YcDwDkZckhjnRiH.jpg"
        },
        {
            "product_name": "7 Nights - Vehicle at Disposal for Round Trip - 1 Night Sigiriya, 1 Night Kandy, 1 Night Nuwara Eliya, 1 Night Yala, 1 Night Galle, 1 Night Bentota, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/tpTYuX1f9ac5KmywxTZuLuNgPzkR1pk7fd7vHepw.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/deGcN0OQ1LBKki7gBCeqj1L1d6b5aBSkwl1L1NXn.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Rr457mGwCTKkl4LMQ4r71HEOx5R9uhT9n0sRXwhB.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/feQrzMjsC4JSwliU7cG2BH5Lmhfre4gOXzpWuE6z.jpg"
        },
        {
            "product_name": "8 Nights - Vehicle at Disposal for Round Trip - 1 Night Anuradha pura ,1 Night Sigiriya, 1 Night Kandy, 1 Night Nuwara Eliya , 1 Night Yala , 1 Night Galle, 1 Night Bentota, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/2SPbGdkFVhITAkpPvaV4RrmuNreGKLJqMjw6J3Xo.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/YVUeozNf0JfKDcqW4739k6eGER3HUmDE2IB9N5DD.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/TqUMj78nVm7QfZMHBoOcWMx6BCyHIZn0S77S41UI.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Xw3nLJ80bUZ7wzbGZ1f7VRDSk3Z4R5DNdpR6OSM7.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/hs33Vjd83CnMSqflEJH8xAwMNXfD6ZyrIQMjDorg.jpg"
        },
        {
            "product_name": "9 Nights - Vehicle at Disposal for Round Trip - 1 Night Anuradhapura, 1 Night Trincomalee, 1 Night Sigiriya, 1 Night Kandy, 1 Night Nuwara Eliya, 1 Night Yala, 1 Night Galle, 1 Night Bentota, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/9BcVVlpKp8YxqsTgnbCwzlrCukQuqvXf6byvDrsu.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/eFub7xwpu5ehuGAIjDf0rfxSSpxH9gKmqQet1ukH.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/vmqAYEOqrT5S2gwUInsNI1cRq6X84OVlfYI4FSqg.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/sTiwlgu75Mho2gACfnN1oryMyux3HoAkh2ykSWO3.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/ZF9EOrjGRPfIzGLnKYMGc4b2XNMCF5ec3h5GWFbF.jpg"
        },
        {
            "product_name": "4 Nights - Vehicle at Disposal for Round Trip - 1 Night Nuwara Eliya, 1 Night Yala, 1 Night Bentota, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/puJ4OyD7LcHUBTmWzvVUa03ZlwtlrobPHMRw74yl.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/lon3LFB5DfFhw9CIeugOxlNLq3Mle3yHQong7Hzr.jpg"
        },
        {
            "product_name": "5 Nights - Vehicle at Disposal for Round Trip - 1 Night Nuwara Eliya, 1 Night Yala, 1 night Galle ,1 Night Bentota, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/eP7Ct1nsxRmLmdZdUCFPv1vIRp0ZsSvwxd0iOky6.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/TvQTBpwNUlUiIc06Frs0OH3JfpbOROSc0dfEtbz2.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/sWB1SoDmqNYneFWr7UYgKjqragnBv3FbFeoUKYhi.jpg"
        },
        {
            "product_name": "5 Nights - Vehicle at Disposal for Round Trip - 1 Night Dambulla, 1 Night Kandy, 1 Night Nuwara Eliya, 1 Night Bentota, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/pztiGkIREx3mYbTJQkoKqSG1hOppD9H9J1uHZDQX.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/SuEJCLbGUT72yYgpI5tGWJ4rlnRjGArLgZEPYmUC.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/suxwj6axJfEXhrprgTR3YV3bgbcBgPake5vqYAva.jpg"
        },
        {
            "product_name": "6 Nights - Vehicle at Disposal for Round Trip - 1 Night Dambulla, 1 Night Kandy, 1 Night Nuwara Eliya, 1 Night Yala, 1 Night Bentota, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/HuNZeBcfmr6i47icYvz4yCvXjcTPVpEHk6Bm6aj5.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/QYLapR8fC8hg8s3CBMQmVagdwgZ79oNO2nE445Ko.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/eYk0QmcZDAymCWvg6WGcMkAEODRPXmL1wGiCc21Z.jpg"
        },
        {
            "product_name": "3 Nights - Vehicle at Disposal for Round Trip - 1 Night Negombo, 1 Night Kandy, 1 night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/7Rk93tYxTHCyyOmWWDywMkLtjHY44ukkrcbEhpnQ.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/kqygLnkDBQmGgoLSZT4fDmUNZn0adJR6Jxzv8Do5.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/KNHWtTgfK4LRec5NvHZy0suOxJBrpJ15fSfzqUFX.jpg"
        },
        {
            "product_name": "7 Nights - Vehicle at Disposal for Round Trip - 1 Night Dambulla, 1 Night Kandy, 1 Night Nuwara Eliya, 1 Night Yala, 1 Night Galle, 1 Night Bentota, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/iYEfJ1dJga0cIXW3yPAjoUJLIkxoyqRdpsq17sxG.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/CgnhxbaJsiJVWjTGvIZdnDDnARwAC5qGmnuDqRzR.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/mVYtqRzomRjQPreiwptP319HBS2K6EZeP3dga3ts.jpg"
        },
        {
            "product_name": "4 Nights - Vehicle at Disposal for Round Trip - 1 Night Negombo, 1 Night Kandy, 1 Night Nuwara Eliya ,1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/iqdIfZRc6dzHUUXVNLWYYm7W8Yx9I8WiK2FzstPR.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/J6RM4u1eBSHufp9M3o3qnCyEsGYYEMOaZsMJwL66.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/6UEvSQ9Uc2He7deaTW8fdCvwvwHiD5Abu35N8VGn.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/uQrPNw89RVQNcucJKwUeSYXSTIjom406otJAoPjv.jpg"
        },
        {
            "product_name": "5 Nights - Vehicle at Disposal for Round Trip - 2 Night Kandy, 1 Night Nuwara Eliya, 1 Night Bentota, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/ruk70Hb5zgQRudnS0ayD3ACibcWcYP03XdmE5cay.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/amQ57ItHiIpySmrKOZRw9kj9VuFDOwzUGYdZZbot.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/gE74xPIOf4opJqWvo7GIUFATY50y3I4R4cH90VBP.jpg"
        },
        {
            "product_name": "5 Nights - Vehicle at Disposal for Round Trip - 1 Night Negombo, 1 Night Kandy, 1 Night Nuwara Eliya, 1 Night Bentota,1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/6JBgL9ryKD4HkY8NtCiAEWUcqn97TwZow2HsVAIM.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/sP4WUDZ68qRTWejX4qjekkHyOY9ezm4j3zcaxpUe.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Zo7TVs21HBbjIC9nzdPHpQKApCCnKuw6bhxRPBoK.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/acXx9lWC2nyw9btUg8QHSp0UhiklmAQ62MV510pe.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/lPiLWwt3rtpcnftHPfx5FykPhjvQMDytQ2JXfkWm.jpg"
        },
        {
            "product_name": "6 Nights - Vehicle at Disposal for Round Trip - 1 Night Sigiriya, 2 Night Kandy, 2 Night Nuwara Eliya, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/b3eAtAmtemaPcuBwFktGNQi5Rzzxyvgb4OHoqviF.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/4CY4Y0UofHNkX0GiCHnD6g58hVBsCK16hdQBsT4J.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/wFphgi8UWlrnkorMDJzcWb9hjhVNqQxIVvxMGYNd.png"
        },
        {
            "product_name": "4 Nights - Vehicle at Disposal for Round Trip - 1 Night Dambulla, 2 Night Nuwara Eliya, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/OMJPdeeERkwkWDAu9LXA8D67grIMvlZdBC2PUBCe.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/1VNCMGOlFKENB6KQt6ykVdLS2aJwxp33MM2VXNml.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/BclJB6IeKN2E7dbNOYtc8Hv8nVOaBLFhVRMIt3a6.jpg"
        },
        {
            "product_name": "5 Nights - Vehicle at Disposal for Round Trip - 1 Night Kandy, 1 Night Nuwara Eliya, 1 Night Yala ,1 Night Bentota,1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/6v6EZJrQAKskPsxi22MZ7fjIrZTlKwBsIb0ufRyM.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/GIxrA5xQr9ZKuSxK0BNrMPfN4vVPTH7QyGp3H6R4.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/261JRTBmrvje2iPXiJVLp6scA2FBGwokpIP1S3Oy.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/xwsmoh48AK3SBLvev6Ike6V4lxkGLhvb6bj2Lbhb.jpg"
        },
        {
            "product_name": "5 Nights - Vehicle at Disposal for Round Trip 2 Night Kandy, 1 Night Nuwara Eliya, 1 Night Bentota, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/bQneON7H098GLKY172Zi9jbkOqgRUYiQmQMuki9z.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/lnzVajfvuBjKbw92FQQeO9G7uhZ5Ch5PKHX3j2u2.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Z071F6dk1KBLD9qxgV9wpTPc4OjLXpWWam89HUpk.jpg"
        },
        {
            "product_name": "5 Nights - Vehicle at Disposal for Round Trip - 2 Night Kandy,2 Night Bentota,1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/rCLBbvfinTFovvq2W8bsAf6nTkRFJTQCum8N8b4W.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/AST2lXyyaZyXn7cyuVl0kctoZ6Nf8WxO4sQft9cq.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/ftf6V3mSO87VIdRdKqJ93qIbLiTUoDxV5jjzLwvE.jpg"
        },
        {
            "product_name": "6 Nights - Vehicle at Disposal for Round Trip - 1 Night Negombo, 1 Night Trincomalee, 1 Night Kandy, 2 Night Nuwara Eliya, 1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/PGd70xu5VcL0X6S6pJ8T210vBV8imrGjFrnNzXac.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Y6WCLrbPVg8X88vV900uaOrJLNTGMO4jgh6iIfG4.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/N2fmy0eAN97vpMvgTW8TpkPUctK9K9v08lTLlu3c.jpg"
        },
        {
            "product_name": "9 Nights - Vehicle at Disposal for Round Trip - 1 Night Negombo,1 Night Anuradha pura,1 Night Sigiriya_x000D_\n1 Night Kandy, I Night Nuwara eliya,1 Night Yala, 1 Night Galle, 1 Night Bentota,1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Z5hfSTLlABkZRtrx9K7wFEHdnbFEUwJlfbmKz48z.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/yad9Gttf7RmC6A2FlbC9rQ46o60bS27kCM2C5ALZ.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/DNtffJdaKV4dZnx3rs1tP0sLYYt3cUH0YR7eZ4ki.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/lqUkB5rgGeb7Jh7EMviKzfpGt7KKfKYDD3dE0dVX.jpg"
        },
        {
            "product_name": "3 Nights - Vehicle at Disposal for Round Trip 3 Night Bentota",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/fNbGuzlahJ1LTi63LPUfGF3lB4nrWH5UnzDLurkx.jpg"
        },
        {
            "product_name": "Colombo to Kandy Excursion\r\nColombo to Kandy Excursion",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/9kEFIgt9lkdzONeXOFDSwstVHrJ2x69ZayonyAgb.jpg"
        },
        {
            "product_name": "Colombo to Nuwara Eliya Excursion",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/67HWuN2SMPLTPkDvoqCwSBllUL7yxn0x2c3r0oMs.jpg"
        },
        {
            "product_name": "Colombo to Bentota Excursion",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Y8ENS1hlLLXMFH0Z1T8cdGEBe8TX9KYndxgILprS.jpg"
        },
        {
            "product_name": "Colombo to Dambulla Excursion",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/QKcYb2UxiIeeB8PyLvoWD6mn1QdrOuqOtz4N9TpN.jpg"
        },
        {
            "product_name": "Colombo to Negombo Excursion",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/YUtXKJlJQigTxg9mgnOvEFvHa5Am8Ey1gjvtvuvz.jpg"
        },
        {
            "product_name": "Colombo to Sigiriya Excursion",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/3NnlYV8NQK4BTJrpNOoYVVWIizd5waStNqZJYuQ7.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/uykfRGTu1l1NHpKuPlQLCurOwWUO5OCMkpt4iAis.jpg"
        },
        {
            "product_name": "Colombo to Galle Excursion",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/ntY2p4jITrJahMEPwy4a0987UGTpjNF8fhQiU51g.jpg"
        },
        {
            "product_name": "Colombo to Anuradhapura Excursion",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/NrgEUww5jo3ZY05B3MxeWIoOkFbdKYEQvvbTFomJ.jpg"
        },
        {
            "product_name": "Nuwara Eliya to Bentota Excursion",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Tg22zeZQB3bYWhwliqHNzIGTI0bu2q8R7vLV1BD9.png"
        },
        {
            "product_name": "Puppet art museum (Ticket only)",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Ks4uKF1RbgQC02TDXMv9ou0EFZ26BQSwuwueRZLf.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/jZNOFCqXFb6BhexpxRzRc3EpkTEeTH19GTKxoACz.png"
        },
        {
            "product_name": "Gangarama Temple (Ticket only)",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/F8vUHrQWe8Wic5HjV94KrY0j1HB1NTzg6oxwN151.png"
        },
        {
            "product_name": "Dehiwala Zoo (Ticket only)",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/MYWecJqlECjXTuVuCahTh30e8AhlqZjrGeG4uy49.png"
        },
        {
            "product_name": "3 Nights - Vehicle at Disposal for Round Trip - 1 Night Kandy,1 Night Nuwara Eliya,1 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/bMYLt80UhhHaXjFBGVrmmHhIiaR2yK93wlzRoAEL.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/JsxsRw8lo0OOgs6mAzO8rAbFgScHul7y2wY88J7X.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/A0LEqNQNSS4Fa6ZFu1bMXx8xeaqvDIyOwpDJtzN8.png"
        },
        {
            "product_name": "1 Night - Vehicle at Disposal for Round Trip - 1 Night  Colombo\r\n1 Night - Vehicle at Disposal for Round Trip - 1 Night  colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/ffo8kODy7su5CfdsgiGpwvR4qJmFzdjnzWhvK0nj.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/lH0YthvClgQjjGYteG5T1fv85gUJlv83iFK4fJaT.png"
        },
        {
            "product_name": "5 Night - Vehicle at Disposal for Round Trip - 5 Night  Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/RChMoTupNKuhCrrTRzZOM0QF0XMcc2w3Ey5o8HXr.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/kHKjAG5Rv5pbOCROXdAJOKuFtbNS36nJ9KJ8hCnV.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/nL1KsPbhA75c1vcKWbFRsR2wCUThS0Y2NeCPJUob.png"
        },
        {
            "product_name": "7 Night - Vehicle at Disposal for Round Trip - 7 Night  Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/3MjJoyq26Ez5HpUV9sIsnzrQKTpSyeKccACGdI6z.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/xcUtfNjQxlusJ8YJAQhrah3EDb5D7jxe8i0EwPlo.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/aLHB4ekQEKbUlD11RlwDFrhdUhESchITKUNlHG7K.png"
        },
        {
            "product_name": "4 Night - Vehicle at Disposal for Round Trip - 4 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/IF0eJ7Dsf2UqAh9M5NUgMRuF8BUTSnJ48M8a0GQN.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/ghQdT8Sv64DCxES3pphm3eSTy6EJxXuCskHZYbRj.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/WF5ARWeSk4Uk8x3gxKB9I9fZp6x8Y8n4vuwXTt4x.png"
        },
        {
            "product_name": "3 Night - Vehicle at Disposal for Round Trip - 3 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Xs7tfYe5zOhxQOPAQ1bxbBXqv1vt89HTatcDhDaW.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/PlEEKZPhdHG9pL2bZwrFxegrMSgBwdrM5xIDXm1P.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/klFbAef7RJD06cpTefn5nM3pujRa6oYBYF3yFp1T.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/VTvdS6xO0whWXXPSZpKafWQhvcIrsYLlA7FXH94y.png"
        },
        {
            "product_name": "6 Night - Vehicle at Disposal for Round Trip - 6 Night Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Y1CEYGKLH9jJ9tqYAFdvbDaB2iJzQQNlgZGWtSWn.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/629m32yMTBPzaayuKYiQY98iELdbiqXT9uNPwhu8.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/C0eqE0eufZdS8S5yE9oEkWSQeDPv1Ob13WizmgxI.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Rf1D21bcYWYxbVDFbnZIyeq5etHvB8nSl7vj7kwf.png"
        },
        {
            "product_name": "5 Night - Vehicle at Disposal for Round Trip - 3 Night Kandy",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/HNAkzV9UBUBdTpM6TRqxUHslBeiwzc0bLlgO36CF.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/uF847rG5EOGRzsRXxvEyKA8ruvCi6wKXnI390YE3.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/uDyDW7DXYAUfyRiif4y11o3uI750Lgc4fD63gPW0.png"
        },
        {
            "product_name": "2 Night - Vehicle at Disposal for Round Trip - 2 Night Kandy",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/54nLvVaME4an6VLVhx1u4tqWxKWKD2Tz3KrfoGFq.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/PBJffO3WIOjdrd3rEe2SdFn0ytrUAILYUopP0hYC.png"
        },
        {
            "product_name": "Couples Dinner cruise (Cruise on Shared Basis) From Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/zNNJGfDSwRGGoq6ZZh9fuTfFPjWOHSCNRUQ5wE2G.png"
        },
        {
            "product_name": "4 Night - Vehicle at Disposal for Round Trip - 4 Night Kandy",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/xNwYEnIBQNWNT1S51Py7UXppzH6il4xCAZNTioOi.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/AcqbQo8ah2Q2fpQY6CGZdHSnZEFSLZB6cM5gW5uz.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/7En4MukhzgPwfU3T38o7f90rV0Yy8OAQOjWWhj9N.png"
        },
        {
            "product_name": "Night Cycling Tour in Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/M3GRp1ZzynK76v0qtTeK57a893S9RHciDG76vHkI.png"
        },
        {
            "product_name": "Street Food Cycling Tour",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/bpUBoqrMNMnb2Uz6j626PQKNbvCnFTMf4FZU7pI1.png"
        },
        {
            "product_name": "War Jeep Tour in Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/wTU82SQshZa7vJdp7UI0X6Iulep77uOFKR0E1nTx.png"
        },
        {
            "product_name": "Morning Cycling Tour",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/9dzqk1yWrowSF8pKxIvQLd2NDHmNayaIrOpdppDu.png"
        },
        {
            "product_name": "Colombo Country Side Cycling",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/RWmi7WUf8N3YIyBX0V1IAuYzC8j4C6FXFoxeEpOS.png"
        },
        {
            "product_name": "Tea Tasting in Colombo",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/Hq8rkBg1Q3rYFjEQRpVj2SaeHkBOKhxUxa5Vh7pC.png"
        },
        {
            "product_name": "1 Night - Vehicle at Disposal for Round Trip - 1 Night Nuwara Eliya",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/RHDGDt2ROX3BxFG5vZlx8hbhzjiQ50vbMhRYFLwI.png,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/HEbjxOVuUSbNN1EDOBz6dfbr3Y5X2vGxhpInbbxE.png"
        },
        {
            "product_name": "7 Night - Vehicle at Disposal for Round Trip - 7 Night Sigiriya",
            "product_address": "Colombo, Sri Lanka",
            "category": "3",
            "product_image": "https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/VcLt4COd7nub4nYdwWfuieZi6DPGsSoMDiF3lYyP.jpg,https://s3-aahaas-prod-assets.s3.ap-southeast-1.amazonaws.com/productImages/lifestyles/XLs7KmDt5mwfEWHXPeu3EC9DkbnCECEeAUKe2T6o.jpg"
        }
    ]


    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" style={{ fontSize: 18 }}>
                    Suggestion for Products
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

            </Modal.Body>
        </Modal>
    );
};

export default ProductSuggestionModal;
