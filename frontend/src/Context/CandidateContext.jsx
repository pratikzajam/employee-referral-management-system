import { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

export let CandidateContext = createContext();

export const useCandidate = () => useContext(CandidateContext);

export let CandidateProvider = ({ children }) => {

    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(false);

    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    console.log(user);

    let getmetricsData = async () => {
        try {
            if (!user || !user._id) return;

            let response = await axios.get(
                `http://localhost:3000/api/matrics/getReferedCandidates/${user._id}`
            );

            console.log("data", response.data);
            setMetrics(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    let deleteCandidate = async (id) => {
        try {
            setLoading(true);
            let response = await axios.delete(
                `http://localhost:3000/api/candidate/candidates/${id}`
            );

            console.log(response.data);
            toast(response.data.message);
            getmetricsData();
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };


    let updateCandidateStatus = async (status, id) => {
        try {
            let response = await axios.put(`http://localhost:3000/api/candidate/candidates/${id}`,
                { status: status }
            );

            console.log(response.data);
            toast(response.data.message);

            setTimeout(() => {
                getmetricsData();
            },1000)


        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }


    let addReferal = async (referralData) => {
        try {

        } catch (error) {

        }
    }





    useEffect(() => {
        if (user && user._id) {
            getmetricsData();
        }

    }, []);

    return (
        <CandidateContext.Provider value={{ metrics, deleteCandidate, updateCandidateStatus }}>
            {children}
        </CandidateContext.Provider>
    );
};
