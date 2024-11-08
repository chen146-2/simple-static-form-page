import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

//import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNktq13a4OQSX1F-v3x9p0hfQVal1cOU8",
  authDomain: "hhc-intern-static-form-site.firebaseapp.com",
  projectId: "hhc-intern-static-form-site",
  storageBucket: "hhc-intern-static-form-site.firebasestorage.app",
  messagingSenderId: "859974016457",
  appId: "1:859974016457:web:a277e477907472df569c18",
  measurementId: "G-9QE1VFP3NE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const storage = getStorage(app);

document.getElementById("generateButton").addEventListener("click", generateDocument);

function generateDocument() {

  const questions = [
    "1)  Was this budgeted for FY25 under Operating or Capital? If it is not budgeted, how will this request be funded? ",
    "2)  What is the Department Code for this request? What is the budget line#, if operating?",
    "3)  Which facilities are included in this request/work order?  Or will this work be done at the Enterprise-level impacting all facilities? ",
    "4)  Is this a new need/project or an increase to the current maintenance/services? Is this one-time or recurring?",
    "5)  List other purchases or projects that are related to this request.",
    "6)  Describe the purchase request and its justification (e.g. need, benefits, risks, consequences). Please specify how it aligns with our strategic plan.",
    "7)  Who is the Technical Point of Contact (POC)?",
    "8)  What is the Contract number, if applicable? Or RFB (request for bid) number if applicable?",
    "9)  Quantity & Total Cost.",
    "10) Please provide the shipping information, if applicable."
  ];

  // Get the title input, defaulting to "Untitled" if the field is empty
  const documentTitle = document.getElementById("documentTitle").value.trim() || "Untitled";

  const answers = [];
  const paragraphs = [];

  // Add title paragraph to the document
  const titleLines = documentTitle.split("\n");
  titleLines.forEach(line => {
    paragraphs.push(new docx.Paragraph({
      children: [new docx.TextRun({ text: line, size: 24 })]
    }));
  });

  paragraphs.push(new docx.Paragraph({})); // Add blank line after title

  // Collect answers and build document paragraphs
  questions.forEach((question, index) => {
    const answerText = document.getElementById(`answer${index + 1}`).value || "N/A";
    answers.push(answerText.replace(/\n/g, "\\n")); // Preserve new lines in Firestore

    // Add question and answer to document paragraphs
    paragraphs.push(new docx.Paragraph({
      children: [new docx.TextRun({ text: question, size: 24 })]
    }));

    const answerLines = answerText.split("\n");
    answerLines.forEach(line => {
      paragraphs.push(new docx.Paragraph({
        children: [new docx.TextRun({ text: line, size: 24 })],
        indent: { left: 360 }
      }));
    });
    paragraphs.push(new docx.Paragraph({})); // Blank line after each answer
  });

  // Create the docx document with the prepared paragraphs
  const doc = new docx.Document({ sections: [{ children: paragraphs }] });

  // Format filename as "Purchase-Document-YYYY-MM-DD--HH-MM-SS.docx"
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const formattedTime = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
  const fileName = `Purchase-Document-${formattedDate}--${formattedTime}.docx`;

  // Save the .docx file locally
  docx.Packer.toBlob(doc).then(blob => {
    saveAs(blob, fileName);
    console.log("Document created successfully!");

    // Store document metadata in Firestore
    saveToFirestore(documentTitle.replace(/\n/g, "\\n"), answers, now);
  }).catch(error => {
    console.error("Error generating document:", error);
  });
}

// Save document data to Firestore
function saveToFirestore(title, answers, timestamp) {
  try {
    addDoc(collection(db, "GeneratedDocuments"), {
      description: title,
      createdAt: timestamp,
      answers: answers
    });
    console.log("Document data saved successfully in Firestore!");
  } catch (error) {
    console.error("Error saving document data to Firestore:", error);
  }
}

document.getElementById("clearButton").addEventListener("click", function() {
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach(textarea => {
    textarea.value = ""; // Clear the value of each textarea
  });
});
