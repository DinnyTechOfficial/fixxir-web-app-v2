"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Laptop,
  Search,
  Smartphone,
  Upload,
} from "lucide-react";
import {
  searchBrands,
  searchModels,
  type DeviceBrand,
  type DeviceModel,
  type DeviceType,
} from "./device-catalog";

interface SelectedDeviceValue {
  id: string | null;
  name: string;
  custom: boolean;
}

interface DeviceStepData {
  deviceType?: DeviceType;
  brand?: SelectedDeviceValue;
  model?: SelectedDeviceValue | null;
  modelUnknown?: boolean;
}

interface RepairFormData {
  step1?: DeviceStepData;
  step2?: Step2Data;
  step3?: Step3Data;
  step4?: Step4Data;
  step5?: Step5Data;
  [key: string]: unknown;
}

interface Step2Data {
  issue?: string;
  details?: string;
  photos?: File[];
}

interface Step3Data {
  name?: string;
  phone?: string;
  email?: string;
}

interface Step4Data {
  area?: string;
  address?: string;
  handoff?: string;
}

interface Step5Data {
  urgency?: string;
}

interface StepNavigationProps {
  data: RepairFormData;
  onNext: () => void;
  onPrev: () => void;
  onChange: (data: RepairFormData) => void;
}

interface Step1Props {
  data: RepairFormData;
  onNext: () => void;
  onChange: (data: RepairFormData) => void;
}

function Step1Device({ data, onNext, onChange }: Step1Props) {
  const [step1Data, setStep1Data] = useState<DeviceStepData>(data.step1 || {});
  const [brandQuery, setBrandQuery] = useState(data.step1?.brand?.name || "");
  const [modelQuery, setModelQuery] = useState(data.step1?.model?.name || "");
  const [brandResults, setBrandResults] = useState<DeviceBrand[]>([]);
  const [modelResults, setModelResults] = useState<DeviceModel[]>([]);
  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [brandLoading, setBrandLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const brandInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const brandRequest = useRef(0);
  const modelRequest = useRef(0);

  useEffect(() => {
    if (!step1Data.deviceType) return;
    const requestId = ++brandRequest.current;
    const timer = window.setTimeout(() => {
      if (requestId === brandRequest.current) {
        setBrandResults(searchBrands(step1Data.deviceType as DeviceType, brandQuery));
        setBrandLoading(false);
      }
    }, 180);
    return () => window.clearTimeout(timer);
  }, [brandQuery, step1Data.deviceType]);

  useEffect(() => {
    if (!step1Data.deviceType || !step1Data.brand || step1Data.brand.custom) return;
    const requestId = ++modelRequest.current;
    const timer = window.setTimeout(() => {
      if (requestId === modelRequest.current) {
        setModelResults(searchModels(step1Data.deviceType as DeviceType, step1Data.brand?.id || "", modelQuery));
        setModelLoading(false);
      }
    }, 180);
    return () => window.clearTimeout(timer);
  }, [modelQuery, step1Data.brand, step1Data.deviceType]);

  const updateStep1 = (next: DeviceStepData) => setStep1Data(next);

  const selectType = (deviceType: DeviceType) => {
    updateStep1({ deviceType });
    setBrandQuery("");
    setModelQuery("");
    setBrandOpen(false);
    setModelOpen(false);
    setErrors({});
  };

  const selectBrand = (brand: DeviceBrand) => {
    updateStep1({ deviceType: step1Data.deviceType, brand: { id: brand.id, name: brand.name, custom: false }, model: null, modelUnknown: false });
    setBrandQuery(brand.name);
    setModelQuery("");
    setBrandOpen(false);
    setModelOpen(false);
    setErrors((current) => ({ ...current, brand: "" }));
    window.setTimeout(() => modelInputRef.current?.focus(), 0);
  };

  const applyCustomBrand = () => {
    const name = brandQuery.trim();
    if (!name) return;
    updateStep1({ deviceType: step1Data.deviceType, brand: { id: null, name, custom: true }, model: null, modelUnknown: false });
    setBrandOpen(false);
    setModelQuery("");
    setErrors((current) => ({ ...current, brand: "" }));
    window.setTimeout(() => modelInputRef.current?.focus(), 0);
  };

  const selectModel = (model: DeviceModel) => {
    updateStep1({ ...step1Data, model: { id: model.id, name: model.name, custom: false }, modelUnknown: false });
    setModelQuery(model.name);
    setModelOpen(false);
    setErrors((current) => ({ ...current, model: "" }));
  };

  const applyCustomModel = () => {
    const name = modelQuery.trim();
    if (!name) return;
    updateStep1({ ...step1Data, model: { id: null, name, custom: true }, modelUnknown: false });
    setModelOpen(false);
    setErrors((current) => ({ ...current, model: "" }));
  };

  const markUnknownModel = () => {
    updateStep1({ ...step1Data, model: null, modelUnknown: true });
    setModelQuery("");
    setModelOpen(false);
    setErrors((current) => ({ ...current, model: "" }));
  };

  const handleNext = () => {
    const nextErrors: Record<string, string> = {};
    if (!step1Data.deviceType) nextErrors.deviceType = "Choose Phone or Laptop.";
    if (!step1Data.brand) nextErrors.brand = "Select or enter a brand.";
    if (step1Data.brand && !step1Data.model && !step1Data.modelUnknown) nextErrors.model = "Select a model, enter one manually, or choose “I’m not sure”.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.deviceType) document.getElementById("device-type")?.focus();
      else if (nextErrors.brand) brandInputRef.current?.focus();
      else modelInputRef.current?.focus();
      return;
    }
    onChange({ ...data, step1: step1Data });
    onNext();
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, type: "brand" | "model") => {
    const results = type === "brand" ? brandResults : modelResults;
    const open = type === "brand" ? brandOpen : modelOpen;
    if (event.key === "Escape") {
      if (type === "brand") setBrandOpen(false);
      else setModelOpen(false);
    } else if (event.key === "ArrowDown" && open && results.length) {
      event.preventDefault();
      document.getElementById(`${type}-option-0`)?.focus();
    } else if (event.key === "Enter" && open && results.length === 0) {
      event.preventDefault();
      if (type === "brand") applyCustomBrand();
      else applyCustomModel();
    }
  };

  return (
    <div className="space-y-7">
      <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Step 1 of 6</p><h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">What do you need repaired?</h2><p className="mt-2 text-sm text-gray-600">Search for your device. If you cannot find it, you can enter it yourself.</p></div>

      <div>
        <label id="device-type" tabIndex={-1} className="mb-3 block text-sm font-semibold text-gray-700">Device type *</label>
        <div className="grid grid-cols-2 gap-3">
          {(["phone", "laptop"] as DeviceType[]).map((type) => {
            const selected = step1Data.deviceType === type;
            return <button type="button" key={type} onClick={() => selectType(type)} aria-pressed={selected} className={`flex min-h-16 items-center justify-center gap-2 rounded-xl border-2 px-4 font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${selected ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-700 hover:border-blue-300"}`}>{type === "phone" ? <Smartphone size={23} /> : <Laptop size={23} />}{type === "phone" ? "Phone" : "Laptop"}</button>;
          })}
        </div>
        {errors.deviceType && <p className="mt-2 text-sm text-red-600" role="alert">{errors.deviceType}</p>}
      </div>

      {step1Data.deviceType && <div className="space-y-7">
        <div className="relative">
          <label htmlFor="brand-search" className="mb-2 block text-sm font-semibold text-gray-700">Brand *</label>
          <div className="relative"><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input ref={brandInputRef} id="brand-search" role="combobox" aria-expanded={brandOpen} aria-controls="brand-results" aria-autocomplete="list" value={brandQuery} onFocus={() => setBrandOpen(true)} onChange={(event) => { setBrandLoading(true); setBrandQuery(event.target.value); setBrandOpen(true); updateStep1({ ...step1Data, brand: undefined, model: null, modelUnknown: false }); }} onKeyDown={(event) => handleInputKeyDown(event, "brand")} placeholder={step1Data.deviceType === "phone" ? "Search phone brand" : "Search laptop brand"} className="min-h-12 w-full rounded-xl border-2 border-gray-200 bg-white pl-11 pr-10 outline-none transition focus:border-blue-600" />{brandLoading && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-600" />}{step1Data.brand && !brandOpen && <Check size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" />}</div>
          {brandOpen && <div id="brand-results" role="listbox" className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg">{brandResults.map((brand, index) => <button type="button" role="option" aria-selected={step1Data.brand?.id === brand.id} id={`brand-option-${index}`} key={brand.id} onClick={() => selectBrand(brand)} className="flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-gray-800 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none">{brand.name}</button>)}{brandQuery.trim() && brandResults.length === 0 && !brandLoading && <p className="px-3 py-3 text-sm text-gray-500">No matching brand found.</p>}{brandQuery.trim() && <button type="button" onClick={applyCustomBrand} className="mt-1 flex min-h-11 w-full items-center rounded-lg border-t border-gray-100 px-3 text-left text-sm font-semibold text-blue-600 hover:bg-blue-50">Use “{brandQuery.trim()}” as brand</button>}</div>}
          {errors.brand && <p className="mt-2 text-sm text-red-600" role="alert">{errors.brand}</p>}
        </div>

        {step1Data.brand && <div className="relative">
          <label htmlFor="model-search" className="mb-2 block text-sm font-semibold text-gray-700">Model *</label>
          <div className="relative"><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><input ref={modelInputRef} id="model-search" role="combobox" aria-expanded={modelOpen} aria-controls="model-results" aria-autocomplete="list" value={modelQuery} onFocus={() => setModelOpen(true)} onChange={(event) => { setModelLoading(true); setModelQuery(event.target.value); setModelOpen(true); updateStep1({ ...step1Data, model: null, modelUnknown: false }); }} onKeyDown={(event) => handleInputKeyDown(event, "model")} placeholder="Search your model" className="min-h-12 w-full rounded-xl border-2 border-gray-200 bg-white pl-11 pr-10 outline-none transition focus:border-blue-600" />{modelLoading && <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-blue-600" />}{(step1Data.model || step1Data.modelUnknown) && !modelOpen && <Check size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" />}</div>
          {modelOpen && <div id="model-results" role="listbox" className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg">{modelResults.map((model, index) => <button type="button" role="option" aria-selected={step1Data.model?.id === model.id} id={`model-option-${index}`} key={model.id} onClick={() => selectModel(model)} className="flex min-h-14 w-full flex-col items-start justify-center rounded-lg px-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"><span className="text-sm font-semibold text-gray-900">{model.name}</span><span className="text-xs text-gray-500">{model.brandName}</span></button>)}{modelQuery.trim() && modelResults.length === 0 && !modelLoading && <p className="px-3 py-3 text-sm text-gray-500">No matching model found.</p>}{modelQuery.trim() && <button type="button" onClick={applyCustomModel} className="mt-1 flex min-h-11 w-full items-center rounded-lg border-t border-gray-100 px-3 text-left text-sm font-semibold text-blue-600 hover:bg-blue-50">Use “{modelQuery.trim()}”</button>}</div>}
          <button type="button" onClick={markUnknownModel} className="mt-3 text-sm font-semibold text-blue-600 hover:underline">Not sure which model you have? <span className="underline">I’m not sure of the model</span></button>
          {step1Data.modelUnknown && <p className="mt-2 text-sm text-gray-600">We’ll identify the exact model during diagnosis.</p>}
          {errors.model && <p className="mt-2 text-sm text-red-600" role="alert">{errors.model}</p>}
        </div>}
      </div>}

      <button type="button" onClick={handleNext} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">Continue <ChevronRight size={20} /></button>
    </div>
  );
}

// Step 2: Problem Description
function Step2Problem({ data, onNext, onPrev, onChange }: StepNavigationProps) {
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
function Step3CustomerInfo({ data, onNext, onPrev, onChange }: StepNavigationProps) {
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
        <p className="text-xs text-gray-600 mt-1">We&apos;ll use this to contact you about your repair</p>
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
function Step4Location({ data, onNext, onPrev, onChange }: StepNavigationProps) {
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
          <strong>Note:</strong> Free pickup/drop-off is only available in selected Lagos locations. We&apos;ll confirm service availability when reviewing your request.
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
function Step5Timing({ data, onNext, onPrev, onChange }: StepNavigationProps) {
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
interface ReviewProps {
  data: RepairFormData;
  onSubmit: () => void;
  onPrev: () => void;
}

function Step6Review({ data, onSubmit, onPrev }: ReviewProps) {
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
            {data?.step1?.deviceType === "phone" ? "Phone" : "Laptop"}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {data?.step1?.brand?.name || "Brand not specified"} — {data?.step1?.modelUnknown ? "Model not sure" : data?.step1?.model?.name || "Model not specified"}
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
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RepairFormData>({});

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
    router.push("/repair/request/success");
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
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
