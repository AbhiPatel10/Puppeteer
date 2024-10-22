const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/html', (req, res) => {
    res.sendFile(path.join(__dirname, 'template.html'));
});

app.get('/download-pdf', async (req, res) => {
    try {
      const renderHTML = (templatePath, data) => {
        return new Promise((resolve, reject) => {
            fs.readFile(templatePath, 'utf-8', (err, html) => {
                if (err) {
                    return reject(err);
                }

                const itemsHTML = data.items.map(item => `
                <tr>
                <td>
                    <div class="product-name">

                        <img src="https://bizline-staging-bucket.s3.ap-south-1.amazonaws.com/productImages/thumbnail/1723444231208-Screenshot 2024-08-12 115633.png" alt="Image" />  
                        ${item.productName}
                    </div>
                </td>
                <td>${item.size}</td>
                <td>${item.quantity}</td>
                <td>₹${item.rate} / ${item.unit}</td>
                <td>₹${item.subtotal}</td>
            </tr>
                `).join('');
                
                // Replace placeholders in the HTML with dynamic data
                const renderedHTML = html
                    .replace('{{customerName}}', data.customerName)
                    .replace('{{orderFrom}}', data.orderFrom)
                    .replace('{{address}}', data.address)
                    .replace('{{orderDate}}', data.orderDate)
                    .replace('{{dispatchDate}}', data.dispatchDate)
                    .replace('{{totalAmount}}', data.totalAmount)
                    .replace('{{orderDate}}', data.orderDate)
                    .replace('{{items}}', itemsHTML);
    
                resolve(renderedHTML);
            });
        });
    };

        const browser = await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox']// To avoid potential permissions issues
        });

        const page = await browser.newPage();

        const data = {
          customerName: "John Doe",
          orderFrom: "Shree Krishna Enterprise",
          address: "31, Jaldeep casa, nr. railway track, Bopal, Ahmedabad, Gujarat - 380058",
          orderDate: "01.08.2023",
          dispatchDate: "01.08.2023",
          totalAmount: "1,03,373.00",
          items: [
            { 
              productName: "Product 1", 
              size: "180 IN x 180 IN", 
              quantity: "10 BOX (10,000 PCS)", 
              rate: "500.00",
              unit: "pcs",
              subtotal: "1000000"
            },
            { 
              productName: "Product 1", 
              size: "180 IN x 180 IN", 
              quantity: "10 BOX (10,000 PCS)", 
              rate: "500.00",
              unit: "pcs",
              subtotal: "1000000"
            },
            { 
              productName: "Product 1", 
              size: "180 IN x 180 IN", 
              quantity: "10 BOX (10,000 PCS)", 
              rate: "500.00",
              unit: "pcs",
              subtotal: "1000000"
            },
            { 
              productName: "Product 1", 
              size: "180 IN x 180 IN", 
              quantity: "10 BOX (10,000 PCS)", 
              rate: "500.00",
              unit: "pcs",
              subtotal: "1000000"
            },
            { 
              productName: "Product 1", 
              size: "180 IN x 180 IN", 
              quantity: "10 BOX (10,000 PCS)", 
              rate: "500.00",
              unit: "pcs",
              subtotal: "1000000"
            },
            { 
              productName: "Product 1", 
              size: "180 IN x 180 IN", 
              quantity: "10 BOX (10,000 PCS)", 
              rate: "500.00",
              unit: "pcs",
              subtotal: "1000000"
            },
            { 
              productName: "Product 1", 
              size: "180 IN x 180 IN", 
              quantity: "10 BOX (10,000 PCS)", 
              rate: "500.00",
              unit: "pcs",
              subtotal: "1000000"
            },
        ]
        }

        const htmlPath = path.join(__dirname, 'template.html');
        // const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

        const htmlContent = await renderHTML(htmlPath, data);
        // await page.setContent(htmlContent, { waitUntil: 'domcontentloaded', timeout: 60000  });
        await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 60000  });

        const pdfBuffer = await page.pdf({
            path: 'output.pdf',
            format: 'A4',
            printBackground: true,
            margin: {
              top: '1.75in',
              bottom: '1.5in',
              left: '0.5in',
              right: '0.5in',
            },
            displayHeaderFooter: true,
            headerTemplate: `<div class="header" style="max-height: 58px; padding:0 40px; display: flex; justify-content: space-between; align-items: center; width: 100%;">
            <div class="left-header" style="display: flex; align-items: center; gap: 8px;">
                <img style="width: 50px; height: 50px; border-radius: 50%;" src="https://bizline-staging-bucket.s3.ap-south-1.amazonaws.com/productImages/thumbnail/1723444231208-Screenshot 2024-08-12 115633.png" alt="Image" />
                <div>
                    <h2 style="color: rgba(0, 0, 0, 0.88); font-size: 18px; font-style: normal; font-weight: 700; line-height: 28px;">Suksaan Enterprise</h2>
                    <p style="color: rgba(0, 0, 0, 0.65); font-size: 12px; font-style: normal; font-weight: 400; line-height: 20px;">Mohit Patel</p>
                </div>
            </div>
            <div class="company-info" style="text-align: right;">
                <h2 style="color: #B2B7C2; font-size: 31px; font-style: normal; font-weight: 600; line-height: 38px;">Order Receipt</h2>
                <p style="color: rgba(0, 0, 0, 0.65); font-size: 12px; font-style: normal; font-weight: 600; line-height: 20px;">#AB2324-01</p>
            </div>
        </div>`,
            footerTemplate: `
            <div class="footer" style="padding:0 40px; width: 100%; padding-bottom: 14px; text-align: start; margin-top: 40px;">
            <span style="width: 200px; color: #0169E6; font-size: 10px; font-style: normal; font-weight: 600; line-height: 20px; padding-bottom: 14px;">Thank you for your business!</span>
            <div class="logo" style="border-top: 1px solid #D7DAE0; text-align: right; padding-top: 20px;">
                <img style="width: 80px;" src="data:image/png;base64,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" alt="Biizline Logo">
            </div>
        </div> `,
            printBackground: true,
        });
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Failed to generate PDF');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
