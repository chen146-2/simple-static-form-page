document.getElementById("generateButton").addEventListener("click", generateDocument);

function generateDocument() {
  const questions = [
    "1)\tWas this budgeted for FY25 under Operating or Capital? If it is not budgeted, how will this request be funded? ",
    "2)\tWhat is the Department Code for this request? What is the budget line#, if operating?",
    "3)\tWhich facilities are included in this request/work order?  Or will this work be done at the Enterprise-level impacting all facilities? ",
    "4)\tIs this a new need/project or an increase to the current maintenance/services? Is this one-time or recurring?",
    "5)\tList other purchases or projects that are related to this request:",
    "6)\tDescribe the purchase request and its justification (e.g. need, benefits, risks, consequences). Please specify how it aligns with our strategic plan:",
    "7)\tWho is the Technical Point of Contact (POC)?",
    "8)\tWhat is the Contract number, if applicable? Or RFB (request for bid) number if applicable?",
    "9)\tQuantity & Total Cost:",
    "10)\tPlease provide the shipping information, if applicable:"
  ];

  const answers = [];
  for (let i = 1; i <= 10; i++) {
    const answer = document.getElementById(`answer${i}`).value.trim();
    answers.push( answer || "N/A"); // Default to "N/A" if input is empty
  }

  // Create a new document
  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: questions.map((question, index) => {
          return [
            new docx.Paragraph({
              children: [
                new docx.TextRun({ text: question, bold: false, size: 24, }) // Question in bold
              ]
            }),
            new docx.Paragraph({
              children: [
                new docx.TextRun({ text: answers[index], size: 24, }) // Answer below the question
              ]
            }),
            new docx.Paragraph({}) // Empty paragraph for spacing
          ];
        }).flat()
      }
    ]
  });

  // Get the current date and time
  const now = new Date();
  const formattedDate = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${now.getFullYear()}:${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  // Generate the filename
  const filename = `Purchase Document - ${formattedDate}.docx`;

  // Generate and save the document
  docx.Packer.toBlob(doc).then((blob) => {
    saveAs(blob, filename);
    console.log("Document created successfully");
  });
}
