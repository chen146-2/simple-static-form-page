document.getElementById("generateButton").addEventListener("click", generateDocument);

function generateDocument() {
  const questions = [
    "1)  Was this budgeted for FY25 under Operating or Capital? If it is not budgeted, how will this request be funded? ",
    "2)  What is the Department Code for this request? What is the budget line#, if operating?",
    "3)  Which facilities are included in this request/work order?  Or will this work be done at the Enterprise-level impacting all facilities? ",
    "4)  Is this a new need/project or an increase to the current maintenance/services? Is this one-time or recurring?",
    "5)  List other purchases or projects that are related to this request:",
    "6)  Describe the purchase request and its justification (e.g. need, benefits, risks, consequences). Please specify how it aligns with our strategic plan:",
    "7)  Who is the Technical Point of Contact (POC)?",
    "8)  What is the Contract number, if applicable? Or RFB (request for bid) number if applicable?",
    "9)  Quantity & Total Cost:",
    "10) Please provide the shipping information, if applicable:"
  ];

  // Initialize paragraphs array with the title paragraph
  const paragraphs = [
    new docx.Paragraph({
      children: [
        new docx.TextRun({
          text: "Title of Purchase Request – Hardware Warranty",
          size: 24 // Font size of 12pt
        })
      ]
    }),
    new docx.Paragraph({}) // Blank line after the title for spacing
  ];

  // Loop through each question and answer to build the document's paragraphs
  questions.forEach((question, index) => {
    const answerTextarea = document.getElementById(`answer${index + 1}`);
    const answerText = answerTextarea.value || "N/A";

    // Add the question as a paragraph
    paragraphs.push(new docx.Paragraph({
      children: [
        new docx.TextRun({
          text: question,
          size: 24 // Set font size to 12pt
        })
      ]
    }));

    // Process each line in the answer text and add an indent to each line
    const answerLines = answerText.split("\n");
    answerLines.forEach(line => {
      paragraphs.push(new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: line,
            size: 24 // Set font size to 12pt
          })
        ],
        indent: {
          left: 360 // Approx. equivalent to one tab (1/4 inch) in Word
        }
      }));
    });

    // Add a blank paragraph for spacing between questions
    paragraphs.push(new docx.Paragraph({}));
  });

  // Initialize the document with sections
  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: paragraphs
      }
    ]
  });

  const now = new Date();
  const formattedDate = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${now.getFullYear()}:${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const fileName = `Purchase Document - ${formattedDate}.docx`;

  // Generate and save the document
  docx.Packer.toBlob(doc).then(blob => {
      saveAs(blob, fileName);
      console.log("Document created successfully!");
  }).catch(error => {
      console.error("Error generating document:", error);
  });
}

document.getElementById("clearButton").addEventListener("click", function() {
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach(textarea => {
    textarea.value = ""; // Clear the value of each textarea
  });
});
