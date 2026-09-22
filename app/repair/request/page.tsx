"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Smartphone,
  Laptop,
  CheckCircle2,
} from "lucide-react";

// Step 1: Device Type & Model
function Step1Device({ data, onNext, onChange }: any) {
  const [step1Data, setStep1Data] = useState(data?.step1 || {});

  const phones = [
    { name: "iPhone", models: ["iPhone 15", "iPhone 14", "iPhone 13", "iPhone 12", "iPhone 11", "Other iPhone"] },
    { name: "Samsung", models: ["S24", "S23", "S22", "A54", "A53", "Other Samsung"] },
    { name: "Tecno", models: ["Spark 10", "Camon 20", "Phantom", "Other Tecno"] },
    { name: "Infinix", models: ["Note 30", "Hot 30", "Zero Flip", "Other Infinix"] },
    { name: "Other Android", models: ["Other"] },
  ];

  const laptops = [
    { name: "HP", models: ["Pavilion", "Envy", "EliteBook", "ProBook", "Other HP"] },
    { name: "Dell", models: ["XPS", "Inspiron", "Vostro", "Latitude", "Other Dell"] },
    { name: "Lenovo", models: ["ThinkPad", "Legion", "IdeaPad", "Yoga", "Other Lenovo"] },
    { name: "MacBook", models: ["MacBook Air M1/M2", "MacBook Pro 13", "MacBook Pro 14/16", "Other MacBook"] },
    { name: "Other Windows", models: ["Other"] },
  ];

  const deviceType = step1Data.deviceType;
  const brands = deviceType === "phone" ? phones : deviceType === "laptop" ? laptops : [];

  const handleBrandSelect = (brand: string) => {
    setStep1Data({ ...step1Data, brand, model: "" });
  };

  const handleNext = () => {
    if (!step1Data.deviceType || !step1Data.brand || !step1Data.model) {
      alert("Please select device type, brand, and model");
      return;
    }
    onChange({ ...data, step1: step1Data });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">What do you need repaired?</h2>

      {/* Device Type Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Device Type *</label>
        <div className="flex gap-4">
          {["phone", "laptop"].map((type) => (
            <button
              key={type}
              onClick={() => setStep1Data({ ...step1Data, deviceType: type, brand: "", model: "" })}
              className={`flex-1 py-3 px-4 rounded-lg border-2 font-semibold transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 ${
                step1Data.deviceType === type
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
              aria-pressed={step1Data.deviceType === type}
            >
              {type === "phone" ? <Smartphone size={20} /> : <Laptop size={20} />}
              {type === "phone" ? "Phone" : "Laptop"}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Selection */}
      {deviceType && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Brand</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {brands.map((brand) => (
              <button
                key={brand.name}
                onClick={() => handleBrandSelect(brand.name)}
                className={`py-2 px-3 rounded-lg border-2 text-sm font-semibold transition ${
                  step1Data.brand === brand.name
                    ? "border-blue-600 bg-blue-50 text-blue-600"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Model Selection */}
      {step1Data.brand && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Model</label>
          <div className="space-y-2">
            {brands
              .find((b) => b.name === step1Data.brand)
              ?.models.map((model) => (
                <button
                  key={model}
                  onClick={() => setStep1Data({ ...step1Data, model })}
                  className={`w-full py-2 px-3 rounded-lg border-2 text-left font-medium transition ${
                    step1Data.model === model
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {model}
                </button>
              ))}
          </div>
          <button
            onClick={() => setStep1Data({ ...step1Data, model: "I'm not sure" })}
            className="mt-3 text-blue-600 font-semibold text-sm hover:underline"
          >
            I'm not sure of the model
          </button>
        </div>
      )}

      <button
        onClick={handleNext}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 min-h-[44px] flex items-center justify-center gap-2"
      >
        Continue <ChevronRight size={20} />
      </button>
    </div>
  );
}

// Step 2: Problem Description
function Step2Problem({ data, onNext, onPrev, onChange }: any) {
  const [step2Data, setStep2Data] = useState(data?.step2 || {});

  const phoneIssues = [
    "Broken/cracked screen",
    "Battery problem",
    "Charging problem",
    "Won't power on",
    "Camera problem",
    "Speaker/microphone",
    "Liquid damage",
    "Software problem",
    "Other",
  ];

  const laptopIssues = [
    "Broken/display problem",
    "Battery",
    "Keyboard/trackpad",
    "Charging/power",
    "Slow performance",
    "SSD/RAM upgrade",
    "Won't boot",
    "Liquid damage",
    "Other",
  ];

  const issues = data?.step1?.deviceType === "phone" ? phoneIssues : laptopIssues;

  const handleNext = () => {
    if (!step2Data.issue) {
      alert("Please select an issue");
      return;
    }
    onChange({ ...data, step2: step2Data });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">What is happening with your device?</h2>

      {/* Issue Selection */}
      <div className="space-y-2">
        {issues.map((issue) => (
          <button
            key={issue}
            onClick={() => setStep2Data({ ...step2Data, issue })}
            className={`w-full py-3 px-4 rounded-lg border-2 text-left font-medium transition ${
              step2Data.issue === issue
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            {issue}
          </button>
        ))}
      </div>

      {/* Additional Details */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Tell us more (optional)</label>
        <textarea
          value={step2Data.details || ""}
          onChange={(e) => setStep2Data({ ...step2Data, details: e.target.value })}
          placeholder="Add any additional details about the problem..."
          className="w-full py-2 px-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none"
          rows={4}
        />
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Photos (up to 3, optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto mb-2 text-gray-400" size={32} aria-hidden="true" />
          <p className="text-sm text-gray-600">Click to upload or drag photos here</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = Array.from(e.target.files || []).slice(0, 3);
              setStep2Data({ ...step2Data, photos: files });
            }}
            className="hidden"
            id="photo-upload"
            aria-label="Upload device photos"
          />
          <label htmlFor="photo-upload" className="block cursor-pointer">
            <button
              onClick={() => document.getElementById("photo-upload")?.click()}
              className="mt-2 text-blue-600 font-semibold text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 rounded"
            >
              Select photos
            </button>
          </label>
        </div>
        {step2Data.photos && (
          <p className="text-sm text-gray-600 mt-2" role="status">
            {step2Data.photos.length} photo{step2Data.photos.length !== 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          Continue <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

// Step 3: Customer Info
function Step3CustomerInfo({ data, onNext, onPrev, onChange }: any) {
  const [step3Data, setStep3Data] = useState(data?.step3 || {});

  const handleNext = () => {
    if (!step3Data.name || !step3Data.phone) {
      alert("Please fill in name and phone number");
      return;
    }
    onChange({ ...data, step3: step3Data });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Your contact information</h2>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
        <input
          type="text"
          value={step3Data.name || ""}
          onChange={(e) => setStep3Data({ ...step3Data, name: e.target.value })}
          placeholder="Your name"
          className="w-full py-2 px-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone / WhatsApp *</label>
        <input
          type="tel"
          value={step3Data.phone || ""}
          onChange={(e) => setStep3Data({ ...step3Data, phone: e.target.value })}
          placeholder="e.g., +234 901 234 5678"
          className="w-full py-2 px-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none"
        />
        <p className="text-xs text-gray-600 mt-1">We'll use this to contact you about your repair</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Email (optional)</label>
        <input
          type="email"
          value={step3Data.email || ""}
          onChange={(e) => setStep3Data({ ...step3Data, email: e.target.value })}
          placeholder="your.email@example.com"
          className="w-full py-2 px-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          Continue <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

// Step 4: Location & Handoff
function Step4Location({ data, onNext, onPrev, onChange }: any) {
  const [step4Data, setStep4Data] = useState(data?.step4 || {});

  const lanosAreas = [
    "Ikeja", "VI", "Lekki", "Yaba", "Ikoyi", "Ajah", "Badagry", "Mushin",
    "Surulere", "Shomolu", "Ilupeju", "Akure", "Other"
  ];

  const handoffOptions = [
    { value: "pickup", label: "Pickup — Fixxir will pick up from your location" },
    { value: "dropoff", label: "Drop-off — I'll drop off at Fixxir location" },
    { value: "advise", label: "Let Fixxir advise me — Not sure yet" },
  ];

  const handleNext = () => {
    if (!step4Data.area || !step4Data.handoff) {
      alert("Please select area and handoff preference");
      return;
    }
    onChange({ ...data, step4: step4Data });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Where is your device?</h2>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Area in Lagos</label>
        <select
          value={step4Data.area || ""}
          onChange={(e) => setStep4Data({ ...step4Data, area: e.target.value })}
          className="w-full py-2 px-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none"
        >
          <option value="">Select your area...</option>
          {lanosAreas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Specific Address</label>
        <input
          type="text"
          value={step4Data.address || ""}
          onChange={(e) => setStep4Data({ ...step4Data, address: e.target.value })}
          placeholder="e.g., 123 Allen Avenue, Ikeja"
          className="w-full py-2 px-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">How would you prefer to hand off your device?</label>
        <div className="space-y-2">
          {handoffOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStep4Data({ ...step4Data, handoff: option.value })}
              className={`w-full py-3 px-4 rounded-lg border-2 text-left font-medium transition ${
                step4Data.handoff === option.value
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs sm:text-sm text-gray-700">
          <strong>Note:</strong> Free pickup/drop-off is only available in selected Lagos locations. We'll confirm service availability when reviewing your request.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          Continue <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

// Step 5: Timing
function Step5Timing({ data, onNext, onPrev, onChange }: any) {
  const [step5Data, setStep5Data] = useState(data?.step5 || {});

  const timingOptions = [
    { value: "asap", label: "As soon as possible" },
    { value: "1-2days", label: "Within 1–2 days" },
    { value: "week", label: "This week" },
    { value: "nourgency", label: "No urgent deadline" },
  ];

  const handleNext = () => {
    if (!step5Data.urgency) {
      alert("Please select a timeline");
      return;
    }
    onChange({ ...data, step5: step5Data });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">How soon do you need your device back?</h2>

      <div className="space-y-2">
        {timingOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setStep5Data({ ...step5Data, urgency: option.value })}
            className={`w-full py-3 px-4 rounded-lg border-2 text-left font-medium transition ${
              step5Data.urgency === option.value
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs sm:text-sm text-gray-700">
          This helps us prioritize your repair and give you a realistic timeline.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          Continue <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

// Step 6: Review
function Step6Review({ data, onSubmit, onPrev }: any) {
  const handleSubmit = () => {
    // For now, just log the data
    console.log("Form submitted with data:", data);
    // TODO: Send to backend API
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Review your repair request</h2>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Device</p>
          <p className="text-lg font-semibold text-gray-900">
            {data?.step1?.brand} {data?.step1?.model}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Problem</p>
          <p className="text-lg font-semibold text-gray-900">{data?.step2?.issue}</p>
        </div>

        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Contact</p>
          <p className="text-lg font-semibold text-gray-900">{data?.step3?.name}</p>
          <p className="text-sm text-gray-600">{data?.step3?.phone}</p>
        </div>

        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Location</p>
          <p className="text-lg font-semibold text-gray-900">{data?.step4?.area}</p>
          <p className="text-sm text-gray-600">{data?.step4?.address}</p>
        </div>

        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Timeline</p>
          <p className="text-lg font-semibold text-gray-900">{data?.step5?.urgency}</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs sm:text-sm text-gray-700">
          <strong>Important:</strong> Submitting this request does <strong>not</strong> authorize repair work. Fixxir will review your request and contact you to confirm the next step. Where required, we will diagnose your device before you approve any repair.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
        >
          Submit repair request
        </button>
      </div>
    </div>
  );
}

// Main Form Component
export default function RepairRequestForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    // Navigate to success page
    window.location.href = "/repair/request/success";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs font-semibold text-gray-600 mb-3">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          {currentStep === 1 && <Step1Device data={formData} onNext={handleNext} onChange={setFormData} />}
          {currentStep === 2 && <Step2Problem data={formData} onNext={handleNext} onPrev={handlePrev} onChange={setFormData} />}
          {currentStep === 3 && <Step3CustomerInfo data={formData} onNext={handleNext} onPrev={handlePrev} onChange={setFormData} />}
          {currentStep === 4 && <Step4Location data={formData} onNext={handleNext} onPrev={handlePrev} onChange={setFormData} />}
          {currentStep === 5 && <Step5Timing data={formData} onNext={handleNext} onPrev={handlePrev} onChange={setFormData} />}
          {currentStep === 6 && <Step6Review data={formData} onSubmit={handleSubmit} onPrev={handlePrev} />}
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Questions? Contact us on{" "}
          <a
            href="https://wa.me/2349000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 font-semibold hover:underline"
          >
            WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
