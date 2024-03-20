import 'firebase/analytics';
import '../Chatshome.css'
import React, { useEffect, useRef, useState } from 'react'
import 'firebase/analytics';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faGear, faUserPlus, faAngleDown, faUserMinus, faCircleXmark, faFilter, faCircleInfo, faPen, faTrash, faFlag } from '@fortawesome/free-solid-svg-icons'
import logo from '../Components/img/Customer.png';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { auth, db } from 'src/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import groupIcon from './img/conversation.png'
import nonGroupIcon from './img/team (1).png'

function Chatshome() {

    const resetRef = useRef();
    const scrollBoxRef = useRef(null);

    var baseURL = "https://gateway.aahaas.com/api"

    const [user] = useAuthState(auth);
    const [userID, setUSerID] = useState('');
    const [cusData, setData] = useState([]);
    const [customerChatID, setcustomerChatID] = useState('')
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [searchVendor, setSearchVendor] = useState('');
    const [searchCustomer, setSearchCustomer] = useState('');
    const [selectedVedor, setselectedVedor] = useState([]);
    const [infoDetails, setInfoDetails] = useState('');

    const [customer_message_collections, set_customer_message_collections] = useState([]);
    const [vendorDetails, setVendorDetails] = useState([]);

    const [filteredCustomerChats, setFilteredCustomerChats] = useState([...customer_message_collections]);
    const [filteredVendorDetails, setFilteredVendorDetails] = useState([...vendorDetails]);

    const [showModal, setShowModal] = useState({
        addVendor: false,
        removeVendor: false,
        showInfo: false,
        showEdit: false,
        showFlag: false,
        showDelete: false
    });

    const addSelecetedVendor = (customerChatID) => {
        filteredCustomerChats.map((value) => {
            if (customerChatID === value.customer_collection_id) {
                if (value.supplier_id === '' || value.supplier_id === null || value.supplier_id === undefined) {


                    const dataSet = {
                        customer_collection_id: customerChatID,
                        supplier_id: selectedVedor.id,
                        supplier_name: selectedVedor.username,
                        group_chat: true,
                        supplier_mail_id: selectedVedor.email,
                        supplier_added_date: new Date(),
                        customer_name: infoDetails.customerChatID.customer_name,
                        status: infoDetails.customerChatID.status,
                        comments: '',
                        chat_id: infoDetails.customerChatID.chat_id
                    };

                    try {
                        axios.post(baseURL + '/updatechat', dataSet).then(res => {
                            if (res.data.status === 200) {
                                alert("suppler added successfully")
                            } else {
                                alert('something got mistake')
                            }
                        })
                    } catch (error) {
                        console.log(error);
                        throw new Error(error)
                    }

                } else {
                    alert('vendor is already existing')
                }
            }
        })
    }

    const removeVendor = (customerChatID) => {
        alert(`vendor removed ${customerChatID}`)
    }

    const searchVendorFun = (e) => {
        const searchVendor = e.target.value.toLowerCase();
        setSearchVendor(searchVendor)
        if (searchVendor === '') {
            setFilteredVendorDetails([...vendorDetails]);
        } else {
            const filteredDetails = vendorDetails.filter(
                (vendor) => vendor.supplier_name.toLowerCase().startsWith(searchVendor)
            );
            setFilteredVendorDetails(filteredDetails);
        }
    };

    const searchCustomerFun = (e) => {
        const searchVendor = e.target.value.toLowerCase();
        setSearchCustomer(searchVendor)
        if (searchVendor === '') {
            setFilteredCustomerChats(customer_message_collections);
        } else {
            const filteredDetails = customer_message_collections.filter(
                (vendor) => vendor.customer_name.toLowerCase().startsWith(searchVendor)
            );
            setFilteredCustomerChats(filteredDetails);
        }
    };

    const getGroupchat = (para) => {
        if (para === 'getGrpChat') {
            const filteredDetails = customer_message_collections.filter(
                (vendor) => vendor.group_chat === 'true'
            );
            resetRef.current.style.display = 'block'
            setFilteredCustomerChats(filteredDetails);
        }
        else if (para === 'getPrivateChat') {
            const filteredDetails = customer_message_collections.filter(
                (vendor) => vendor.group_chat === 'false' || null
            );
            resetRef.current.style.display = 'block'
            setFilteredCustomerChats(filteredDetails);
        }
        else {
            setFilteredCustomerChats(customer_message_collections);
            resetRef.current.style.display = 'none'
        }
    };

    const getUserMessages = (value, value3) => {
        setcustomerChatID(value);
        setInfoDetails(value3)
        const q = query(
            collection(db, "chats/chats_dats/" + value),
            orderBy("createdAt", "desc"),
            limit(50)
        );
        const getMessages = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({ ...doc.data(), id: doc.id });
            });
            const sortedMessages = fetchedMessages.sort(
                (a, b) => a.createdAt - b.createdAt
            );
            setMessages(sortedMessages);
            setUSerID(value);
        });
        return getMessages;
    }

    const sendMessage = async (event) => {
        event.preventDefault();
        if (userMessage.trim() === "") {
            return null;
        }
        const uid = 'admin';
        // const { displayName, photoURL } = auth.currentUser;
        await addDoc(collection(db, "chats/chats_dats/" + userID), {
            text: userMessage,
            name: "Admin",
            avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABg1BMVEX///8dn93tGyTzWl1xsOMAdrxwDRD///3lAAD//v/zVVruGyTz5ubwGiP8//8dnt9rAACylJbyzMpnDQ/WHiL///ruEhwdn9rhUlrkAADssLYAc7rvTlNyr+T///fvAAAAldPtAAwAl9rz4N8Aa7YAc78Alc717e349vVzAADt/PxstOhwseBdreMJgMLO5Ot0vNnC4u6x2uUAluLz2dnrxMPcrbDjzsz7U1jDNDDje3nRSk5jAADmrKj6SlXvXF3og4t6ERPoZmvnkY+OICPlQEXonJ7mcHXkTk/iJivgg4L2ytHYXFry2tTWKjP2Fx/aQjzZDBbkn5fmp63X5u692u2cxeN9s9dopMgug7nfRVBIl9bRJiuNt9CrzORTk8DEAANwSVVyb4h2i7BWpOJpEBtuOkjki4ezYHBrgJhvpsXZLUTGVmqqdZWMlcG1bIiSkKzLZXaZhKlOqM9ifq6dWXvMNkmLZIq2NFF1wdg6pNKi1eWw5OwlhrlnutNouN+fucgEOnsbAAARHklEQVR4nO1di3/a2JUW1OSiCF1lPJFkwhiEbDAj4/CIcbqe8U4a1zi4STyOH3ntpK/Znd1Jt92W3e4aTUP/9D3nCoR0BTZOeYj89DnxQ0b+3c/nnve5siBEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoRPGiK8Db4Qr3gZwn+R9G4SBWHkjXMHJZRSWCtAYB/wK7iMH6gHgv9L9yL300JIlNANhpSLNc+nDrYB7J2DZT8aO4B7+O/evYdk3nyCoBsrX/Rx+4uPws/dT/7ps/AJkdLdL342Idz+6uvPQqePlOz98zeTYvjVnTshZPhsghK8cwsYhk0RS9/cnhTDlV/cCh1DKpJHEyP4s1u3wsdQpPe+mJQMv/lFGBkKqdu3J2JmbgPBz0PIkJYeT2qPfvPLW7fCx5DQ/Z9PylH88uswMqS/mpij6EkwbAw3IEqbDFyCIWOYSscnAvnu56FlKE2EoRQxnBtSSTliGDGMGM4ZEcNPnaEky1regaZp8hWOZeEYSkgmn0ufHDx+1Hyxt9fcf3T4pKXl8hqEL58Ew3hcS7aOdlKEVXzZP3hX2n7xJJ//FGQoxY+Tj3/lFLOxasYK+awaLlipppaX8SULzTCef7o2rFqPEGlpP6kFNHKxGMraHh3ZexCB43LreKEZHreeWVevkKaea5K0sAzlkzVKrlkh3U7LC8vwOL1MqW+BpNdz80Clp5xJXRyGUn6fiv71oa8QBP+iKXmvLShDuUVcI0PQcm7c23+0+2j/dJt6bQ8ROCEuDsP83sBJiJSmdpM5FrTl0t9ue++ja/7iwKIwlKST7EBSIt0+yfd8uyRpyW3PwkWqyQvJUDv0frPUOh58Vzr+1qOghD73WdOFYZg79Wrbi5xPRdPbgx1M6Yq2iAzjuWUnCmWRKD3wG5P8jjeQW/EZ00VhKKVTnu+V0pwVanrvXEyG8fjevQGanDHJnwoeIS4mQwmy3lyyh5xX0SRJknN7xKOki8kQKEoDyFK8F19LSDF3RFXPnQvKcAgYSS2fv9v0L/uTYCjJmgbckknt4KhBBX9K/A8xJLP7HYxiCOTyyfTdg8eH+3uNtQ3wfyKdgAxFIhIV3qyz85o6m7Gi4QyPcydPmo21EunNJg678+NkSAg9O794WS6/fTUjKQYZSsBvZWfD4SaKkBoO/12Pz5DgT4KfA+Qq714ulZdWV1fLidfXpdnTYijFc29YdCa6RcThGJchUiOqYJ29e1le2tpccvC2kLmmVDIpBBjK6Sb+wlGCpe29vb1GaoS6XMOwJyF4r4LSXZTL5a2lpVV4c5BJrNfmw1BON/AyiG7t8PlzLd1s/MtO6mP0EOwSmBSmdLAp+8R6KL/NJArfzYWhlGw448/Zo3Su2fj26enRGh1eWLySIQhPtVDpkF15iUN5K5NIZH49E4KB3GKfeT1x402y1dx9DPKkR29KlIg0YG9GMfzyyzufAbmL8lKZF53L8H4CMUrDp8lQe14CgQGfneWSyKbUS7/Z2H0x1Nr4GcaR4ZfA7vPf/u73ZcZtBD24/j0juF6ZA8N807GiJeAkopMvvW/u7LZSdLuxwbN0GWLQKh/f/frOv/7b737/amlzM6B2vAgTDkN7JoroZ5hbQ4L0YUMobWNRUaTLINRW64d07jF/Z5+hpB3n8yfv//0/XpU3r2eHMnzLCGYKP5JZ7FMfQ7nF/LxwmG+lk8sYpYkQZ9GNg7wsp58NYSgDOe39H/7zj6vdzaDFHIHNTAEZFhKvZzIO7mUoaU/wEt1Iy3JcOxCd7hp91kQyxz/4Im+RPoFU8vkf/vRfqyi6zeuJuXv0bcHZpYnZ+Hw/w0MWYTWSaHROUBfBrx1CKgxfHz/x2RtC//znv/wRlG4p4AuuIbiV6GO9PgOCHMMjvESbWM6WTzbA0gh0P+e8QD4p9bgRip4OJbfETOZ4e9MxrWBl77sMZ+Pz/Qx/YM79iBXstaeUPjvc03rFGildcrSGnJdXmR8fk5krvKXVza0tXU8MGM7E5/sZ7uIluu+0JLTDVKqRzveqNcCQ7VJCXq6Wy0uj3R0nOXgZ/i4cdjHAQIaJzKxtqaQ9RmvS75xJxwc/bDcOj96kNaxltBzLQyo3UjzYlvAfyOkOv5huZAaKOAuf72MoP2cMH/bbSlo+fQpxDXgLYL/iWBoQ4Y0Ybm119JgeUxSlx1AZMCy8mzFDoLEBl8RS3G1J5I9Yh+0wH8+9QO9Fs2er43kG2MmrsDGBUoyDRxFnkedzMc0Oy+wfub3B/D12QXihnbBquKheBFOFIVhdddROUXh+XkUs3BemX5HiIu+nFAPulNul1w4wqSD0fe7I2aPW1cTY+62tmD5QvABHryJa0y9l+BnK+WdM2/ZyPYZy8iHWMU5zLZGVxtTz76/Ylwg0KkMEN4Lh+axlGNdWWGxGd/MSVoJlKd+EXHYlx+YzqCrSoBfsX9hkGxMsihJjFIdtUF4RM98J6rVLnCzDeH6fMRQeJbW4jH2MBkRxudYaxmniVxtnQSUEk1IuM28HNjNgVoZAHygi5PmzlmFcTu9hDkyFxt2cJkuSlhKa6V3M8oXSV7nti3KQIlrMns0cLbfhDBMJa9oEh9RL0/tOFZHsrLSSufTGzu4aBcq0cZI/Pt30ig525tb3Q9zBdTAGBNcrM9+lkqwl3zyDlEJQKS2lttdA96gKUcBKMi7l/tJj6LDbYu5gHLFx8HjEdzPfpczcpJ82NryPFNhuHiQhAJdaS5vgx1F8W67O9VyCPsQtjIRHEafv84f2LSB1Tz85Om0sLy/v7B2ttNJ5VrHI/wkSecemBCRnGuMTVDwM7089+B7OECcwWVuNDXjLktMDbq2Wv2cmBWJMr/Ipumm067Y5NkXT9YiF9ann+ePP6kvyX5XO0AXrRreSFc7GJhhTEoW+DDPn0y5H3YChFC8ONZtKp6YSSqziRzBMZF4KoWEox3P/PcxwKm2LqFiTaytjG9b7g8DttTplf3GTEyX5/xkqQSvL8iq1qgQN0Ah4QtOpF9xuwFDS/hr07rpRg3AHK3Skrozt+01vnh8ehnGmiJyUlC7pD9lYxXEdhu4LvqfPUBr7FGnudWCtZt21FLQzrgx1bxb8atp6mJZlWRoT+f8NLNbwqFF3TIIQDg1MTeH+1C1NLpnMjYdk7v8CizUH5TJiPxiboVcRz6bLsNRYvgEeBvTQHLTISKV4TXbvgSe9qE+3kkGGP75rBMDncStVLgcMrevqF0MZJn6cbhYsinT009k4gNGsclm8EuuQ/mw0ETrj5xeuqckkXodoCo6K5wa/VMPqL5CQ6vgMBz4/M/3g+yawDN4jmO5YDCF1P8Or6CozzfNvANLhIzPFdg0FmBofP5YljwrkPHn+jAZrxkTV5Bl2+yc0qEg9DE2zaOgd3TBGpI3egluYZKjaAYa66qY/ateRsA4pf9c+syxVtSqXHUMPRqwej1h4PZvBmvFALIPfdkXHUFBaEgTb2ZRm8dIiRGWH3uBDrW0GtqruVcQp+/wbgajBDKnONhnrBtSYQzS7YF9FHNzE/UuB5U8dPivxBt/rs2iyjQtKulf4fCe9MGyS9d8lEisQKniD7x9nzOIqUDVQcFLaA4+tgs8v1ljLzHMqE+RJrIAUPcH332bQZBsXhFQCtrHoVuaJUAWCuDfZkUyPiRRJjfekrs/PJNat8DCEtfOyUGKV/vpAwsWa6hgeq27XB7PvIhXa/G/Go4izmmofD23O9CuQXvQPndKK3SsOVjpGzNQrHtnUuYBP9w3WhMkl2rxzU7r9+TTwDyqb2MDSIsYzRU9rSeUSD1+TjYRIhqCIvPvuuB5b7H1GbFYW1z3Zo5C1uds8Laj7YXosL/j8oKkJ2Imu81swq55TpxX+xgHDzFmYLI0QKO2bdX595NKJC7wMqar7jZRnm64HfsI8QS75GMzr83uvqTlb2awNrom0y+VTIfX5kAUGosx2QAK0aqKVvfTMyIpgo3x3ectRr2fK4RoEFVHXA934rGpvdTo2zRLP+e8K19hQEi5F8PmhsTWiGqj86kZgAg+IWR90XUeO7kVwIRzDQt/SrNf4nzA/QMbQ5RkqdT7qIiLtmNhL1W2WZ1AWCHQUvya6oWkGfH6YbI0diNuqPEOI33riUjrVmuUULYVLToEH5ajCr2cytz8uKoGopsO/RLSKTt1R103FNIrFoo1xABe1D0xNJjHyjNw8QANNpiJvatSqS0bBrano8BKRz0t8BbcwBW5qIAs2a9zy3Ja3oreLyMtsU0in+Ea4x+e/CxNDcsHXQhXbmxsQMYv7UXEkWLNqtm3XcE6V8BmURxFfhYphzeAZdr2WBg2p0sskwAo5BSl8gXrJy36giKEquKkW32RSdN9pE6FiQFrhBAYQDmRZVQpvrPHBgm+Ydl58gqDCFqeIuuFbHwbeOno//Fas5u5g0TK4Up3P1MyByghQwu82Rfce8KFZiHq6xAlDFfPDwFkSfl5s1gdoxgXfggFJVb3ft4pAuZ8PKsXBTBDhG+FuFpxJzGCYdnwQvgWl6D6fD2qIWXGbvUjpeKwk7/MHHjGToSFiCLuNW6injQgAz47pBqMDGgnOXBx8xw+vIoapGiVUA6am4kl/1G7xJxwi6jptmuLg5H1g+M1VxML6WYgcIigiJws9ZjslT1btpp2OioNSaGtwtNao9ONqlSuB6KYrwu/C5PKxqhRoIzoM8UmuoKY2SwuxWdFmatpzJqJa5fP8vgj/Nu0JvpuBkA7fgtKzvUM1dUutmRUs8aoGtvm7KMZeOU5UOeG7TTbQwlAxpEKXZ9jz+aT6oNhtd9jnNVPX26CN8EFvU1btD5ZAmCIWQlWKYiB8eTdmOKELBYGZSpe9qKro+gURrTZ8fPCBZp0SyHBTY4VKCwVn/olb6gUyQFcIrqOOR/nBquBsJlWtDo6C29hUZCUQn/gNPLe+XlfHnuqZFQJmX3FKirapO1GqqOJLMDUmLMZRjJ+cF/DjGQnWt5gvm6Hgm7pKx8kAcfk62lWwN7rSYbO1kG5Bml9kpXuq+0uK+n0IZ0LVP+yDryrFsKQoYs8pplRVrMlVQVhOuEqIjVVkVq/K1k2OYSHz3Zy5DAWp8T5fsQkVa3gew6wJuEshC445/QiQ4iXs3q5qndnVNlcWNjOvQ+UnXAQr31UCaRUuvmiJrIWoKIbFpImiA4l+aBeLfXpYn2KnFE193Z43l6EQSYcLanBKkQVlYHMgTYAMS9c7JMuezlaxq+hFTBS1cxsOaupGsXtRs/4+7RMXHweRz4IxvVAtMC5s0k1ERdX1S5Va9Wq7aLCz6r2Tz3hsyjSLnapdgTCAhPIvzwqsBcVvU7Om1h8Aw2IFYm+Sxfis29VNPInfn0pV2OY0jM5l/Qwfceb/M8ThAgnGX+aFalVxbKYCkgHRYR0AzRFOTjOVw86+abRhY1LnTw6Hcne6wIoht08xVgOjGevaHzpcmwnImbqpdy/OrMAD3sMKUfjAZxcxQiv1LmrcAyXmm3kH0XWq52dUVYm4IPwQNj/lpDOT4uHFjik6ame5T+FbIATGTtAB+IWqGHrXrlls0mbey/0IBIJvnVkUx5Er4BCYP2CxqCAu0uYcoK0Eznkpjuk0i+2X5xYlqrqYwusBi9o+e4keA2RXbF+CP8DnnlIh+KcxFglY1FY84oN9aXS6diVMLZZ/DBRnKxxnhzNsLAzD4W58GuG81zYZENp2no+EsqsyfzDvJU0YFIJrcOV6G/wB2JRRzxteYFAIvquodqxMuIAOfQyImP3NexFThSpe+5ehIkSIECFChAgRIkSIECFChAgRIkSIECFChAgRIkQIOf4fVph1NNyNKgkAAAAASUVORK5CYII=",
            createdAt: serverTimestamp(),
            role: "Admin",
            readAt: null,
            uid: "admin",
        });
        setUserMessage("");
    }

    const getTime = (value, type) => {
        if (value?.seconds !== undefined && value?.nanoseconds !== undefined) {
            const ts = (value.seconds + value.nanoseconds / 1000000000) * 1000;
            if (type === "value1") {
                return new Date(ts).toLocaleDateString();
            }
            if (type === "value2") {
                return new Date(ts).toDateString();
            }
        }
        return '';
    };

    const fetchData = async () => {
        let allChatData = [];
        try {
            const data_promise = filteredCustomerChats.map(async (value) => {
                if (value.customer_collection_id !== null && value.customer_collection_id !== undefined && value.customer_collection_id !== '') {
                    const q = query(
                        collection(db, "chats/chats_dats/" + value.customer_collection_id),
                        orderBy("createdAt", "asc"),
                        limit(50)
                    );
                    const querySnapshot = await getDocs(q);
                    const fetchedMessages = [];
                    querySnapshot.forEach((doc) => {
                        fetchedMessages.push({ ...doc.data(), id: doc.id });
                    });
                    const sortedMessages = fetchedMessages.sort(
                        (a, b) => a.createdAt - b.createdAt
                    );
                    if (sortedMessages.length !== 0) {
                        allChatData = [...allChatData, { customerChatID: value, sortedMessages }]
                        return { customerChatID: value, sortedMessages };
                    }
                }

            })
            await Promise.all(data_promise);
            setData(allChatData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const scrollDown = () => {
        if (scrollBoxRef.current) {
            scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
        }
    };

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
    };

    const signOut = () => {
        auth.signOut();
    };

    useEffect(() => {
        fetchData();
    }, [customer_message_collections, filteredCustomerChats]);

    useEffect(() => {
        try {
            axios.get(baseURL + '/getchats').then(res => {
                if (res.data.status === 200) {
                    const result = res.data.data
                    const sorted_result = result.sort(function (a, b) {
                        const dateA = new Date(a.updated_at);
                        const dateB = new Date(b.updated_at);
                        return dateB - dateA;
                    });
                    set_customer_message_collections(sorted_result);
                    setFilteredCustomerChats(sorted_result);
                }
            })
        } catch (error) {
            console.log(error);
        }

        try {
            axios.get(baseURL + '/getvendors').then(res => {
                if (res.data.status === 200) {
                    setVendorDetails(res.data.data);
                    setFilteredVendorDetails(res.data.data);
                }
            })
        } catch (error) {
            console.log(error);
        }
    }, [])

    useEffect(() => {
        scrollDown()
    }, [messages]);

    const [editButtons, setEditButtons] = useState({
        state: false,
        key: ''
    })

    const handleMouseEnter = (value) => {
        setEditButtons({
            state: true,
            key: value
        });
    };

    const handleMouseLeave = (value) => {
        setEditButtons({
            state: false,
            key: ''
        });
    };



    return (
        <div className="d-flex main_container">
            <div className="col-3 user_chat_details">
                <div className="col-11 search_box d-flex align-items-center justify-content-start ">
                    <img draggable='false' src={logo} className='admin_logo' />
                    <input className="col-9 my-2 " value={searchCustomer} placeholder="Search user..." onChange={(e) => searchCustomerFun(e)} />
                </div>
                <div className='d-flex'>
                    <button className='btn filter_buttons' onClick={() => { getGroupchat('getGrpChat') }}>Group chat</button>
                    <button className='btn filter_buttons' onClick={() => { getGroupchat('getPrivateChat') }}>private chat</button>
                    <button className='btn filter_buttons reset_buttons' ref={resetRef} style={{ display: 'none' }} onClick={() => { getGroupchat('') }}>
                        <span className='mx-2'>reset</span>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                    {/* <button className='ms-auto mx-4 filter_buttons btn'> */}
                    {/* <FontAwesomeIcon icon={faFilter} size='xl' style={{ color: "#000000", }} /> */}
                    {/* </button> */}
                </div>
                <div className="customer_head">
                    {
                        cusData.map((value, key) => (
                            <div className="customer_details" key={key} onClick={() => getUserMessages(value.customerChatID.customer_collection_id, value)}>
                                <img draggable='false' className="user_image" src={value.customerChatID.chat_avatar} alt='user profile' />
                                <p className='user_name'>{value?.customerChatID.customer_name} {value.customerChatID.group_chat && `collabed with ${value.customerChatID.supplier_name}`}</p>
                                <p className='last_time'>{value?.customerChatID.updated_at.slice(11, 16)}</p>
                                <p className='user_last_msg'>{value?.sortedMessages[value.sortedMessages.length - 1]?.text}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
            {
                messages.length > 0 &&
                <div className="col-8">
                    <div className="main_customer_head">
                        <img draggable='false' className="user_image user_image_main" src={messages[0]?.avatar || logo} />
                        <p className="user_name_main">{messages[0]?.name}</p>
                        <p className="user_last_seen_main">last seen at {getTime(messages[messages.length - 1]?.createdAt, "value2")}</p>
                        <FontAwesomeIcon icon={faUserPlus} className="add_vendor_icon" onClick={() => setShowModal(prevState => ({ ...prevState, addVendor: true }))} />
                        <FontAwesomeIcon icon={faUserMinus} className="close_vendor_icon" onClick={() => setShowModal(prevState => ({ ...prevState, removeVendor: true }))} />
                        <FontAwesomeIcon icon={faGear} className="settings_icon" onClick={() => setShowModal(prevState => ({ ...prevState, showInfo: true }))} />
                        {/* {
                            user ?
                                <button onClick={signOut} className="sign_out_button" type="button">Sign Out</button>
                                :
                                <button className="sign_in_button">
                                    <img draggable='false' onClick={googleSignIn} src={googleSignIn} alt="sign in with google" type="button" />
                                </button>
                        } */}
                    </div>
                    <div className="chat_msg_update" ref={scrollBoxRef}>
                        <div className='main_chat_container'>

                            {messages.map((value, key) => (
                                <div className={`${value.uid == "admin" ? "chat_bubble_main right_side main_chat" : "chat_bubble_main left_side main_chat"}`} key={key}
                                    onMouseEnter={() => { handleMouseEnter(key) }}
                                    onMouseLeave={() => { handleMouseLeave(key) }}
                                >
                                    <img draggable='false' src={value.avatar} className="chat_user_image" />
                                    <p className="chat_context">{value.text} </p>
                                    <span className="chat_time">{getTime(value?.createdAt, "value2")}</span>
                                    <div className='edit_buttons'
                                        style={{ display: editButtons.state && editButtons.key === key ? 'block' : 'none' }}>
                                        <span>
                                            <FontAwesomeIcon icon={faPen} onClick={() => setShowModal(prevState => ({ ...prevState, showEdit: true }))} />
                                        </span>
                                        <span>
                                            <FontAwesomeIcon icon={faTrash} onClick={() => setShowModal(prevState => ({ ...prevState, showDelete: true }))} />
                                        </span>
                                        <span>
                                            <FontAwesomeIcon icon={faFlag} onClick={() => setShowModal(prevState => ({ ...prevState, showFlag: true }))} />
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {/* <FontAwesomeIcon icon={faAngleDown} className="go_down_button" onClick={scrollDown} /> */}
                        </div>
                    </div>



                    <div className="message_send_content d-flex">

                        <input type="text" className="col-9" value={userMessage} placeholder={`chat with user...`} onChange={(e) => setUserMessage(e.target.value)} />
                        <button className="col-1 send_icon_main" onClick={sendMessage}>
                            Send <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                        <button className='col-2 go_down_icon' onClick={scrollDown}>
                            Go down <FontAwesomeIcon icon={faAngleDown} size='xl' />
                        </button>

                    </div>
                </div>
            }

            <Modal show={showModal.addVendor} className="model_popup">
                <div className="container">
                    <div className="">
                        <input className="form-control mb-2 mt-4" placeholder="Search vendor name..."
                            type="text"
                            value={searchVendor}
                            onChange={(e) => { searchVendorFun(e) }}
                        />
                        <p className='mx-2'>Supplier : {selectedVedor.username}</p>
                        <div className="search_main">
                            {filteredVendorDetails.map((brand, index) => (
                                <div className="search_results" key={index}>
                                    <li key={index} onClick={() => setselectedVedor(brand)}>{brand.username}  ({brand.email})</li>
                                    <p>{brand.category || 'no details'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='container mb-5 mt-4 d-flex justify-content-evenly'>
                        <button className='btn btn-primary' onClick={() => addSelecetedVendor(customerChatID)} >Add</button>
                        <button className='btn btn-danger ' onClick={() => setShowModal(prevState => ({ ...prevState, addVendor: false }))}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Modal show={showModal.removeVendor} className="model_popup">
                <div className="remove_pop_up container">
                    <p className='text-center border-bottom py-5 fs-4'>Are you sure to remove the supllier.. ?</p>
                    <div className='d-flex justify-content-around col-6 offset-3 my-3'>
                        <button className='btn btn-primary px-3 mx-5 col-4' onClick={() => { removeVendor(customerChatID) }}>Yes</button>
                        <button className='btn btn-danger px-3 mx-5 col-4' onClick={() => setShowModal(prevState => ({ ...prevState, removeVendor: false }))}>No</button>
                    </div>
                </div>
            </Modal>

            <Modal show={showModal.showEdit} className="model_popup">
                <div className="remove_pop_up container">
                    <p className='text-center border-bottom py-4'>Enter your message...</p>
                    <div className='col-10 m-auto'>
                        <input type='text' className='form-control text-center py-4' placeholder='Enter your message...' />
                    </div>
                    <div className='d-flex justify-content-around col-6 offset-3 my-3'>
                        <button className='btn btn-primary px-3 mx-5 col-6' >Yes</button>
                        <button className='btn btn-danger px-3 mx-5 col-6' onClick={() => setShowModal(prevState => ({ ...prevState, showEdit: false }))}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Modal show={showModal.showDelete} className="model_popup">
                <div className="remove_pop_up container">
                    <p className='text-center border-bottom py-5 fs-4'>Are you sure delete the message ?</p>
                    <div className='d-flex justify-content-around col-6 offset-3 my-3'>
                        <button className='btn btn-primary px-3 mx-5 col-4' >Yes</button>
                        <button className='btn btn-danger px-3 mx-5 col-4' onClick={() => setShowModal(prevState => ({ ...prevState, showDelete: false }))}>No</button>
                    </div>
                </div>
            </Modal>

            <Modal show={showModal.showFlag} className="model_popup">
                <div className="remove_pop_up container">
                    <p className='text-center border-bottom py-4'>Reason why it should be flag ?</p>
                    <div className='col-10 m-auto'>
                        <input type='text' className='form-control text-center py-3' placeholder='Enter your message...' />
                    </div>
                    <div className='d-flex justify-content-around col-6 offset-3 my-3'>
                        <button className='btn btn-primary px-3 mx-5 col-4' >Yes</button>
                        <button className='btn btn-danger px-3 mx-5 col-4' onClick={() => setShowModal(prevState => ({ ...prevState, showFlag: false }))}>No</button>
                    </div>
                </div>
            </Modal>


            <Modal show={showModal.showInfo} className="model_popup">
                <div className="remove_pop_up">
                    <div className='heading border-bottom'>
                        <p className='fs-5 mx-3'><FontAwesomeIcon icon={faCircleInfo} className='info_icon' /></p>
                        <p className='fs-5'>Chat info</p>
                    </div>
                    {infoDetails && showModal.showInfo &&
                        <div className='border p-4'>
                            <p>Chat created : {getTime(infoDetails.sortedMessages[0].createdAt, 'value2')}</p>
                            <p>Chat type : {infoDetails.customerChatID.group_chat || 'private chat'}</p>
                            <p>Supplier added date : {(infoDetails.customerChatID.supplier_added_date) || 'no details'}</p>
                            <p>Supplier mail id : {infoDetails.customerChatID.supplier_mail_id}</p>
                            <p>Supplier name :{infoDetails.customerChatID.supplier_name} </p>
                            <p>Customer mail id :{infoDetails.customerChatID.customer_mail_id} </p>
                            <p>Query status : {infoDetails.customerChatID.status} </p>

                            {/* {console.log(infoDetails)} */}

                            {/* need to add if it is necessary */}

                            {/* <select className='border-0 p-1 outline-0'>
                                <option value="select" selected>{infoDetails.customerChatID.status}</option>
                                <option value="completed">completed</option>
                                <option value="pending">pending</option>
                                <option value="rejected">rejected</option>
                            </select> */}

                            {/* <p>
                                Comments :
                                <input className='border-0 border-bottom mx-2' placeholder='Your comments here...' />
                            </p> */}
                        </div>
                    }
                    <div className='buttons d-flex justify-content-center m-4'>
                        <button className='btn btn-primary mx-4' onClick={() => { setShowModal(prevState => ({ ...prevState, showInfo: false })) }}>Okay</button>
                        <button className='btn btn-secondary mx-4' onClick={() => { setShowModal(prevState => ({ ...prevState, showInfo: false })) }}>Cancel</button>
                    </div>
                </div>
            </Modal>

        </div>
    )
}

export default Chatshome;