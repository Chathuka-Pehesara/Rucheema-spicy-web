import React, { useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CreditCard, Building2, Upload, CheckCircle2, ShieldCheck,
  ArrowLeft, FileDown, User, Hash, DollarSign, Calendar,
  Lock, ChevronRight, Loader2, X
} from 'lucide-react';
import './Payment.css';
import { jsPDF } from 'jspdf';

const generateTxnId = () => `RCH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { total = 0, subtotal = 0, tax = 0, shipping = 0, orderItems = [] } = location.state || {};

  const [step, setStep] = useState('method'); // 'method' | 'bank' | 'card' | 'processing' | 'success'
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [txnId] = useState(generateTxnId());
  const [txnTime] = useState(new Date());
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Bank form state
  const [bankForm, setBankForm] = useState({ senderName: '', reference: '', amount: '', receipt: null });
  const [bankErrors, setBankErrors] = useState({});

  // Card form state
  const [cardForm, setCardForm] = useState({ cardNumber: '', holderName: '', expiry: '', cvv: '' });
  const [cardErrors, setCardErrors] = useState({});

  // --- Bank Transfer Logic ---
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) { setUploadedFile(file); setBankForm(f => ({ ...f, receipt: file })); }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setUploadedFile(file); setBankForm(f => ({ ...f, receipt: file })); }
  };

  const validateBank = () => {
    const errs = {};
    if (!bankForm.senderName.trim()) errs.senderName = 'Sender name is required';
    if (!bankForm.reference.trim()) errs.reference = 'Transaction reference is required';
    if (!bankForm.amount || isNaN(bankForm.amount)) errs.amount = 'Valid amount is required';
    if (!bankForm.receipt) errs.receipt = 'Please upload your bank receipt';
    setBankErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitBankPayment = () => {
    if (!validateBank()) return;
    setStep('processing');
    setTimeout(() => setStep('success'), 2500);
  };

  // --- Card Logic ---
  const formatCardNumber = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (val) => {
    const d = val.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const validateCard = () => {
    const errs = {};
    if (cardForm.cardNumber.replace(/\s/g, '').length < 16) errs.cardNumber = 'Enter a valid 16-digit card number';
    if (!cardForm.holderName.trim()) errs.holderName = 'Cardholder name is required';
    if (cardForm.expiry.length < 5) errs.expiry = 'Enter valid expiry date';
    if (cardForm.cvv.length < 3) errs.cvv = 'Enter valid CVV';
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submitCardPayment = () => {
    if (!validateCard()) return;
    setStep('processing');
    setTimeout(() => setStep('success'), 2500);
  };

  // --- PDF Receipt ---
  const downloadReceipt = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentW = pageW - margin * 2;

    // ── Background ──
    doc.setFillColor(255, 253, 245); // cream
    doc.rect(0, 0, pageW, pageH, 'F');

    // ── Top crimson header band ──
    doc.setFillColor(102, 0, 0); // #660000
    doc.rect(0, 0, pageW, 42, 'F');

    // ── Gold accent strip under header ──
    doc.setFillColor(212, 175, 55); // gold
    doc.rect(0, 42, pageW, 3, 'F');

    // ── Brand name ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(255, 253, 245);
    doc.text('RUCHEEMA', pageW / 2, 18, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(212, 175, 55);
    doc.text('ARTISANAL SPICE HOUSE', pageW / 2, 26, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(255, 253, 245, 0.7);
    doc.text('PAYMENT RECEIPT', pageW / 2, 35, { align: 'center' });

    let y = 60;

    // ── Transaction Summary Box ──
    doc.setFillColor(249, 245, 235); // #F9F5EB
    doc.setDrawColor(232, 223, 200);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, y, contentW, 36, 4, 4, 'FD');

    // Left accent bar
    doc.setFillColor(139, 0, 0);
    doc.roundedRect(margin, y, 3, 36, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(139, 0, 0);
    doc.text('TRANSACTION DETAILS', margin + 8, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);

    const txnDetails = [
      ['Transaction ID', txnId],
      ['Payment Method', selectedMethod === 'bank' ? 'Bank Transfer' : 'Visa / Credit Card'],
      ['Date & Time', txnTime.toLocaleString()],
    ];

    txnDetails.forEach(([label, value], i) => {
      const rowY = y + 16 + i * 7;
      doc.setTextColor(150, 130, 100);
      doc.setFontSize(7.5);
      doc.text(label.toUpperCase(), margin + 8, rowY);
      doc.setTextColor(45, 45, 45);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text(String(value), margin + 60, rowY);
      doc.setFont('helvetica', 'normal');
    });

    y += 46;

    // ── Order Items Header ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(139, 0, 0);
    doc.text('ORDER ITEMS', margin, y);
    y += 5;

    // Column headers
    doc.setFillColor(232, 223, 200);
    doc.rect(margin, y, contentW, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(102, 0, 0);
    doc.text('ITEM', margin + 3, y + 4.5);
    doc.text('QTY', margin + contentW * 0.65, y + 4.5);
    doc.text('UNIT', margin + contentW * 0.78, y + 4.5);
    doc.text('TOTAL', margin + contentW * 0.9, y + 4.5);
    y += 10;

    // Item rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    orderItems.forEach((item, i) => {
      const rowBg = i % 2 === 0 ? [255, 253, 245] : [249, 245, 235];
      doc.setFillColor(...rowBg);
      doc.rect(margin, y - 3, contentW, 8, 'F');

      doc.setTextColor(45, 45, 45);
      doc.text(String(item.name).slice(0, 38), margin + 3, y + 2);
      doc.text(String(item.qty), margin + contentW * 0.65, y + 2);
      doc.text(`$${Number(item.price).toFixed(2)}`, margin + contentW * 0.78, y + 2);
      doc.setFont('helvetica', 'bold');
      doc.text(`$${(item.price * item.qty).toFixed(2)}`, margin + contentW * 0.9, y + 2);
      doc.setFont('helvetica', 'normal');
      y += 8;
    });

    y += 4;

    // ── Totals Box ──
    doc.setDrawColor(232, 223, 200);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + contentW, y);
    y += 5;

    const totalsData = [
      ['Subtotal', `$${subtotal.toFixed(2)}`, false],
      ['Shipping', `$${shipping.toFixed(2)}`, false],
      ['Tax (8%)', `$${tax.toFixed(2)}`, false],
    ];

    totalsData.forEach(([label, val]) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(120, 100, 80);
      doc.text(label, margin + contentW * 0.6, y);
      doc.setTextColor(45, 45, 45);
      doc.text(val, margin + contentW, y, { align: 'right' });
      y += 7;
    });

    // Grand total row
    doc.setFillColor(102, 0, 0);
    doc.roundedRect(margin, y, contentW, 10, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 253, 245);
    doc.text('TOTAL PAID', margin + 4, y + 6.5);
    doc.setTextColor(212, 175, 55);
    doc.text(`$${total.toFixed(2)}`, margin + contentW - 3, y + 6.5, { align: 'right' });
    y += 20;

    // ── Thank You note ──
    doc.setFillColor(249, 245, 235);
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentW, 22, 3, 3, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(102, 0, 0);
    doc.text('Thank You for Your Patronage', pageW / 2, y + 8, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 100, 80);
    doc.text('Your artisanal spice order is being carefully prepared for dispatch.', pageW / 2, y + 15, { align: 'center' });

    // ── Footer ──
    doc.setFillColor(102, 0, 0);
    doc.rect(0, pageH - 18, pageW, 18, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(212, 175, 55);
    doc.text('Rucheema Artisanal Spice House  |  info@rucheema.com  |  www.rucheema.com', pageW / 2, pageH - 9, { align: 'center' });
    doc.setTextColor(255, 253, 245, 0.5);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageW / 2, pageH - 4, { align: 'center' });

    doc.save(`Rucheema_Receipt_${txnId}.pdf`);
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="payment-page">
      {/* Progress Bar */}
      <div className="pay-progress-bar">
        <div className={`pay-step ${['method','bank','card','processing','success'].indexOf(step) >= 0 ? 'done' : ''}`}>
          <span>1</span> Cart
        </div>
        <div className="pay-connector" />
        <div className={`pay-step ${['bank','card','processing','success'].indexOf(step) >= 0 ? 'done' : step === 'method' ? 'active' : ''}`}>
          <span>2</span> Payment
        </div>
        <div className="pay-connector" />
        <div className={`pay-step ${step === 'success' ? 'done' : ''}`}>
          <span>3</span> Success
        </div>
      </div>

      <div className="payment-content">

        {/* ── METHOD SELECTION ── */}
        {step === 'method' && (
          <div className="pay-card animate-slide-up">
            <button className="pay-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={18} /> Back to Cart
            </button>
            <h1 className="pay-title">Choose Payment <span>Method</span></h1>
            <p className="pay-subtitle">Select your preferred way to complete this order</p>

            <div className="pay-order-summary">
              <span>Order Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <div className="pay-methods-grid">
              <button
                className={`pay-method-card ${selectedMethod === 'bank' ? 'selected' : ''}`}
                onClick={() => setSelectedMethod('bank')}
              >
                <div className="pay-method-icon bank-icon"><Building2 size={36} /></div>
                <h3>Bank Transfer</h3>
                <p>Transfer directly and upload your receipt for manual verification</p>
                {selectedMethod === 'bank' && <div className="selected-badge"><CheckCircle2 size={18} /></div>}
              </button>

              <button
                className={`pay-method-card ${selectedMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setSelectedMethod('card')}
              >
                <div className="pay-method-icon card-icon"><CreditCard size={36} /></div>
                <h3>Visa / Credit Card</h3>
                <p>Securely pay with your Visa or Mastercard. Instant processing.</p>
                {selectedMethod === 'card' && <div className="selected-badge"><CheckCircle2 size={18} /></div>}
              </button>
            </div>

            <button
              className="btn-pay-continue"
              disabled={!selectedMethod}
              onClick={() => setStep(selectedMethod)}
            >
              Continue <ChevronRight size={18} />
            </button>
            <div className="pay-security-note"><ShieldCheck size={14} /> Secured by 256-bit SSL Encryption</div>
          </div>
        )}

        {/* ── BANK TRANSFER ── */}
        {step === 'bank' && (
          <div className="pay-card animate-slide-up">
            <button className="pay-back-btn" onClick={() => setStep('method')}><ArrowLeft size={18} /> Back</button>
            <h1 className="pay-title">Bank <span>Transfer</span></h1>

            <div className="bank-details-box">
              <h4>Transfer Funds To:</h4>
              <div className="bank-detail-row"><span>Account Name</span><strong>Rucheema Spice House (Pvt) Ltd</strong></div>
              <div className="bank-detail-row"><span>Account Number</span><strong>100-200-300-4567</strong></div>
              <div className="bank-detail-row"><span>Bank</span><strong>Bank of Ceylon</strong></div>
              <div className="bank-detail-row"><span>Branch</span><strong>Kandy Main Branch</strong></div>
              <div className="bank-detail-row highlight"><span>Amount</span><strong>${total.toFixed(2)}</strong></div>
            </div>

            <div className="pay-form">
              <div className="pay-input-group">
                <label><User size={14} /> Sender Name</label>
                <input
                  type="text"
                  placeholder="Your full name as on bank account"
                  value={bankForm.senderName}
                  onChange={e => setBankForm(f => ({ ...f, senderName: e.target.value }))}
                  className={bankErrors.senderName ? 'error' : ''}
                />
                {bankErrors.senderName && <span className="pay-error">{bankErrors.senderName}</span>}
              </div>

              <div className="pay-input-group">
                <label><Hash size={14} /> Transaction Reference Number</label>
                <input
                  type="text"
                  placeholder="Bank-issued reference code"
                  value={bankForm.reference}
                  onChange={e => setBankForm(f => ({ ...f, reference: e.target.value }))}
                  className={bankErrors.reference ? 'error' : ''}
                />
                {bankErrors.reference && <span className="pay-error">{bankErrors.reference}</span>}
              </div>

              <div className="pay-input-group">
                <label><DollarSign size={14} /> Amount Paid</label>
                <input
                  type="number"
                  placeholder={`${total.toFixed(2)}`}
                  value={bankForm.amount}
                  onChange={e => setBankForm(f => ({ ...f, amount: e.target.value }))}
                  className={bankErrors.amount ? 'error' : ''}
                />
                {bankErrors.amount && <span className="pay-error">{bankErrors.amount}</span>}
              </div>

              {/* Drag & Drop Upload */}
              <div className="pay-input-group">
                <label><Upload size={14} /> Upload Bank Receipt</label>
                <div
                  className={`drop-zone ${dragOver ? 'drag-over' : ''} ${uploadedFile ? 'has-file' : ''} ${bankErrors.receipt ? 'error' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  {uploadedFile ? (
                    <div className="uploaded-file">
                      <CheckCircle2 size={24} className="upload-success-icon" />
                      <span>{uploadedFile.name}</span>
                      <button onClick={e => { e.stopPropagation(); setUploadedFile(null); setBankForm(f => ({ ...f, receipt: null })); }}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="drop-icon" />
                      <p>Drag & drop your receipt here</p>
                      <span>or click to browse files</span>
                    </>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} hidden />
                {bankErrors.receipt && <span className="pay-error">{bankErrors.receipt}</span>}
              </div>

              <button className="btn-pay-submit" onClick={submitBankPayment}>
                Submit Bank Payment
              </button>
              <div className="pay-security-note"><ShieldCheck size={14} /> Your data is encrypted and secure</div>
            </div>
          </div>
        )}

        {/* ── VISA CARD ── */}
        {step === 'card' && (
          <div className="pay-card animate-slide-up">
            <button className="pay-back-btn" onClick={() => setStep('method')}><ArrowLeft size={18} /> Back</button>
            <h1 className="pay-title">Card <span>Payment</span></h1>

            {/* Live Card Preview */}
            <div className="card-preview">
              <div className="card-chip"></div>
              <div className="card-number-display">
                {(cardForm.cardNumber || '•••• •••• •••• ••••').padEnd(19, '•').slice(0, 19)}
              </div>
              <div className="card-bottom-row">
                <div>
                  <small>Card Holder</small>
                  <p>{cardForm.holderName || 'YOUR NAME'}</p>
                </div>
                <div>
                  <small>Expires</small>
                  <p>{cardForm.expiry || 'MM/YY'}</p>
                </div>
                <div className="card-brand">VISA</div>
              </div>
            </div>

            <div className="pay-form">
              <div className="pay-input-group">
                <label><CreditCard size={14} /> Card Number</label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  value={cardForm.cardNumber}
                  maxLength={19}
                  onChange={e => setCardForm(f => ({ ...f, cardNumber: formatCardNumber(e.target.value) }))}
                  className={cardErrors.cardNumber ? 'error' : ''}
                />
                {cardErrors.cardNumber && <span className="pay-error">{cardErrors.cardNumber}</span>}
              </div>

              <div className="pay-input-group">
                <label><User size={14} /> Cardholder Name</label>
                <input
                  type="text"
                  placeholder="As printed on card"
                  value={cardForm.holderName}
                  onChange={e => setCardForm(f => ({ ...f, holderName: e.target.value.toUpperCase() }))}
                  className={cardErrors.holderName ? 'error' : ''}
                />
                {cardErrors.holderName && <span className="pay-error">{cardErrors.holderName}</span>}
              </div>

              <div className="pay-input-row">
                <div className="pay-input-group">
                  <label><Calendar size={14} /> Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardForm.expiry}
                    maxLength={5}
                    onChange={e => setCardForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                    className={cardErrors.expiry ? 'error' : ''}
                  />
                  {cardErrors.expiry && <span className="pay-error">{cardErrors.expiry}</span>}
                </div>
                <div className="pay-input-group">
                  <label><Lock size={14} /> CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    maxLength={4}
                    value={cardForm.cvv}
                    onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '') }))}
                    className={cardErrors.cvv ? 'error' : ''}
                  />
                  {cardErrors.cvv && <span className="pay-error">{cardErrors.cvv}</span>}
                </div>
              </div>

              <button className="btn-pay-submit" onClick={submitCardPayment}>
                <Lock size={16} /> Pay Now — ${total.toFixed(2)}
              </button>
              <div className="pay-security-note"><ShieldCheck size={14} /> PCI DSS Compliant Secure Payment</div>
            </div>
          </div>
        )}

        {/* ── PROCESSING ── */}
        {step === 'processing' && (
          <div className="pay-processing animate-fade-in">
            <div className="processing-spinner"><Loader2 size={64} className="spin-icon" /></div>
            <h2>Processing Payment...</h2>
            <p>{selectedMethod === 'bank' ? 'Verifying your bank receipt submission' : 'Authorizing with secure payment gateway'}</p>
            <div className="processing-steps">
              <span className="proc-step done">✓ Encrypting Data</span>
              <span className="proc-step done">✓ Connecting to Bank</span>
              <span className="proc-step active">⟳ Authorizing...</span>
            </div>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {step === 'success' && (
          <div className="pay-success animate-scale-in">
            <div className="success-ring">
              <CheckCircle2 size={80} className="success-check-icon" />
            </div>
            <h1>Payment <span>Successful!</span></h1>
            <p>Your order has been confirmed and is being prepared for dispatch.</p>

            <div className="txn-details-box">
              <div className="txn-row"><span>Transaction ID</span><strong>{txnId}</strong></div>
              <div className="txn-row"><span>Method</span><strong>{selectedMethod === 'bank' ? 'Bank Transfer' : 'Visa Card'}</strong></div>
              <div className="txn-row"><span>Amount</span><strong>${total.toFixed(2)}</strong></div>
              <div className="txn-row"><span>Date & Time</span><strong>{txnTime.toLocaleString()}</strong></div>
            </div>

            <div className="success-actions">
              <button className="btn-download-receipt" onClick={downloadReceipt}>
                <FileDown size={18} /> Download Payment Receipt
              </button>
              <Link to="/dashboard" className="btn-track-order">Track My Order</Link>
              <Link to="/" className="btn-pay-back-home">Return Home</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
