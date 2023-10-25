import { useContract, useContractWrite, useContractRead } from "@thirdweb-dev/react";
import { Web3Button } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import { CONTRACT_ADDRESS } from "./constants/address";

export default function Doctor() {
    const [patientAddress, setPatientAddress] = useState("");
    const [medicationName, setMedicationName] = useState("");
    const [dosage, setDosage] = useState("");
    const [instructions, setInstructions] = useState("");
    const [patient, setPatient] = useState(null);
    const [showPatientInfo, setShowPatientInfo] = useState(false);
    const [patients, setPatients] = useState([]);
    const [testName, setTestName] = useState("");

    const { contract } = useContract(CONTRACT_ADDRESS);
    const { data, isLoadingData } = useContractRead(contract, "showOurPatients", []);
    const { mutateAsync: addPrescription, isLoading } = useContractWrite(contract, "addPrescription");
    const { data: patientData, loading } = useContractRead(contract, "getPatient", [patientAddress]);
    const { mutateAsync: requestTest, isRequestingTest } = useContractWrite(contract, "requestTest");



    const handleAddPrescription = async () => {
        try {
            await addPrescription({ args: [patientAddress, medicationName, dosage, instructions] });
            console.info("contract call success");
            // Reset the form
            setPatientAddress("");
            setMedicationName("");
            setDosage("");
            setInstructions("");
        } catch (err) {
            console.error("contract call failure", err);
        }
    };

    const handleRequestTest = async () => {
        try {
            await requestTest({ args: [patientAddress, testName] });
            console.info("contract call successs");
        } catch (err) {
            console.error("contract call failure", err);
        }
    };


    const handleGenerateReport = () => {
        setShowPatientInfo(true);
        setPatientAddress("");
    };


    useEffect(() => {
        if (patientData) {
            const [
                address,
                name,
                age,
                diseaseName,
                prescription,
                medicationDelivered,
                testRequested,
                sampleCollected,
                testType,
                observations,
            ] = patientData;

            const formattedPatient = {
                address,
                name,
                age: age.toString(),
                diseaseName,
                prescription: {
                    medicationName: prescription[0],
                    dosage: prescription[1].toString(),
                    instructions: prescription[2],
                },
                medicationDelivered,
                testRequested,
                sampleCollected,
                testType,
                observations,
            };

            setPatient(formattedPatient);
        }
    }, [patientData]);

    useEffect(() => {
        if (data) {
            const formattedPatients = data.map((patient) => ({
                address: patient.patientAddress,
                name: patient.name,
                age: patient.age.toString(),
            }));

            setPatients(formattedPatients);
        }
    }, [data]);

    return (

        <div className="patient-list">

            <div>
                <header className="header2">
                    <nav className="navbar">
                        <a href="/" style={{background:"gray", borderRadius:"10px", padding:"5px"}}>Logout</a>
                    </nav>
                </header>
            </div>


            <div className="background"></div>


            <div className="container2">
                {/* <div className="welcome-doc-div"><h3 className="welcome-doc">Welcome Patient!</h3></div> */}
                <h3 className="patient-list-title">Patient Report</h3>      
    
                <div className="deliver-meds">
                    <input
                        type="text"
                        placeholder="Patient Address"
                        value={patientAddress}
                        onChange={(e) => setPatientAddress(e.target.value)}
                    />
                    <Web3Button
                        contractAddress={CONTRACT_ADDRESS}
                        action={handleGenerateReport}
                        disabled={loading}
                    >
                        Generate Report
                    </Web3Button>
                </div>

                <div className="content2">
                    {showPatientInfo && patient && (
                        <div className="details-cards">
                            <div className="patient-card1">
                                <h2>Patient Information</h2>
                                <p>Address: {patient.address}</p>
                                <p>Name: {patient.name}</p>
                                <p>Age: {patient.age}</p>
                                <p>Disease Name: {patient.diseaseName}</p>
                                <p>Medication Delivered: {patient.medicationDelivered.toString()}</p>
                                <p>Test Requested: {patient.testRequested.toString()}</p>
                            </div>
                            <div className="patient-card1">
                                <h2>Prescription</h2>
                                <p>Medication Name: {patient.prescription.medicationName}</p>
                                <p>Dosage: {patient.prescription.dosage}</p>
                                <p>Instructions: {patient.prescription.instructions}</p>
                                <p>Test Type: {patient.testType}</p>
                                <p>Sample Collected: {patient.sampleCollected}</p>
                                <p>Observations: {patient.observations}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>





        // <div>
        //     <div>
        //         <h1>Patient Report</h1>
        //         <input
        //             type="text"
        //             placeholder="Patient Address"
        //             value={patientAddress}
        //             onChange={(e) => setPatientAddress(e.target.value)}
        //         />
        //         <Web3Button
        //             contractAddress={CONTRACT_ADDRESS}
        //             action={handleGenerateReport}
        //             disabled={loading}
        //         >
        //             Check the Report
        //         </Web3Button>
        //     </div>

        //     {showPatientInfo && patient && (
        //         <div>
        //             <h2>Patient Information</h2>
        //             <p>Address: {patient.address}</p>
        //             <p>Name: {patient.name}</p>
        //             <p>Age: {patient.age}</p>
        //             <p>Disease Name: {patient.diseaseName}</p>
        //             <p>Medication Delivered: {patient.medicationDelivered.toString()}</p>
        //             <p>Test Requested: {patient.testRequested.toString()}</p>
        //             <h2>Prescription</h2>
        //             <p>Medication Name: {patient.prescription.medicationName}</p>
        //             <p>Dosage: {patient.prescription.dosage}</p>
        //             <p>Instructions: {patient.prescription.instructions}</p>
        //             <p>Sample Collected: {patient.sampleCollected}</p>
        //             <p>Test Type: {patient.testType}</p>
        //             <p>Observations: {patient.observations}</p>
        //         </div>
        //     )}
        // </div>
    );
}