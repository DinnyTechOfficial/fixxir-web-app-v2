"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BatteryCharging,
  BatteryLow,
  Bug,
  CameraOff,
  Check,
  CircleQuestionMark,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Ellipsis,
  Flame,
  Keyboard,
  Loader2,
  Laptop,
  MemoryStick,
  MicOff,
  MonitorOff,
  PlugZap,
  PowerOff,
  Search,
  Smartphone,
  Turtle,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  FIXXIR_BUSINESS_ADDRESS,
  FIXXIR_PHONE_DISPLAY,
  FIXXIR_PHONE_LINK,
  FIXXIR_SUPPORT_HOURS,
  getFixxirWhatsAppUrl,
} from "../../site-info";
import {
  getPublicDeviceTypes,
  getPublicManufacturers,
  getPublicModels,
  PublicApiError,
  publicApi,
  type PublicCatalogItem,
  type PublicDeviceType,
} from "../public-api";

const repairWizardStepHistoryKey = "fixxirRepairWizardStep";

function writeRepairWizardStepToHistory(step: number, replace = false) {
  const currentState = window.history.state;
  const state = currentState && typeof currentState === "object" ? currentState : {};
  const nextState = { ...state, [repairWizardStepHistoryKey]: step };

  if (replace) {
    window.history.replaceState(nextState, "", window.location.href);
  } else {
    window.history.pushState(nextState, "", window.location.href);
  }
}

interface SelectedDeviceValue {
  id: string;
  name: string;
}

interface DeviceStepData {
  deviceType?: string;
  deviceTypeLabel?: string;
  deviceIssues?: string[];
  brand?: SelectedDeviceValue;
  model?: SelectedDeviceValue | null;
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
  issues?: string[];
  details?: string;
}

interface Step3Data {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

interface Step4Data {
  area?: string;
  state?: string;
  address?: string;
  handoff?: string;
  collectionDate?: string;
  collectionWindow?: string;
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

function getDeviceTypeIcon(code: string): LucideIcon {
  if (code === "phone") return Smartphone;
  if (code === "laptop") return Laptop;
  return Wrench;
}

function getIssueIcon(label: string): LucideIcon {
  const normalized = label.toLowerCase();
  if (normalized === "not sure") return CircleQuestionMark;
  if (normalized === "other") return Ellipsis;
  if (normalized.includes("overheat") || normalized.includes("hot")) return Flame;
  if (normalized.includes("battery")) return BatteryLow;
  if (normalized.includes("boot") || normalized.includes("turn on") || normalized.includes("power on")) return PowerOff;
  if (normalized.includes("charg")) return BatteryCharging;
  if (normalized.includes("power")) return PlugZap;
  if (normalized.includes("screen") || normalized.includes("display")) return MonitorOff;
  if (normalized.includes("camera")) return CameraOff;
  if (normalized.includes("speaker") || normalized.includes("microphone")) return MicOff;
  if (normalized.includes("liquid")) return Droplets;
  if (normalized.includes("keyboard") || normalized.includes("trackpad")) return Keyboard;
  if (normalized.includes("slow")) return Turtle;
  if (normalized.includes("software")) return Bug;
  if (normalized.includes("upgrade") || normalized.includes("memory")) return MemoryStick;
  return Wrench;
}

function ScreenDamageIcon({ deviceType }: { deviceType: string }) {
  if (deviceType === "phone") {
    return (
      <svg viewBox="0 0 32 32" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-blue-600">
        <rect x="8.5" y="2.5" width="15" height="27" rx="3" />
        <path d="M14 5.5h4M15.2 26.4h1.6" />
        <path d="m16.8 9-3.5 5 3.6 1.8-3.1 4.5 4.4 1.5-2.1 3.2M13.5 14l-2-1.8M16.9 15.8l3.2-2.4M17.8 21.8l3.1 1.1" />
      </svg>
    );
  }

  if (deviceType === "laptop") {
    return (
      <svg viewBox="0 0 32 32" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-blue-600">
        <rect x="5" y="3.5" width="22" height="19" rx="1.8" />
        <path d="M2.5 25h27l-2 3H4.5l-2-3Z" />
        <path d="m17 6.5-4 5.2 4 1.8-3.5 4.1 4.8 1.7-2 2.4M13 11.7l-3-1.5M17 13.5l4-2.2M18.3 17.6l4 .8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-blue-600">
      <rect x="3.5" y="5" width="25" height="19" rx="2" />
      <path d="M11 28h10M16 24v4M17 7.5l-4 5 4 2-3.5 4.2 4.8 1.8-2 2.1M13 12.5l-3-1.7M17 14.5l4-2.2M18.3 18.7l4 .8" />
    </svg>
  );
}

function Step1Device({ data, onNext, onChange }: Step1Props) {
  const [step1Data, setStep1Data] = useState<DeviceStepData>(data.step1 || {});
  const [brandQuery, setBrandQuery] = useState(data.step1?.brand?.name || "");
  const [modelQuery, setModelQuery] = useState(data.step1?.model?.name || "");
  const [deviceTypes, setDeviceTypes] = useState<PublicDeviceType[]>([]);
  const [brandResults, setBrandResults] = useState<PublicCatalogItem[]>([]);
  const [modelResults, setModelResults] = useState<PublicCatalogItem[]>([]);
  const [brandOpen, setBrandOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [deviceTypesLoading, setDeviceTypesLoading] = useState(true);
  const [brandLoading, setBrandLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [brandHasNext, setBrandHasNext] = useState(false);
  const [modelHasNext, setModelHasNext] = useState(false);
  const [brandPage, setBrandPage] = useState(1);
  const [modelPage, setModelPage] = useState(1);
  const [catalogError, setCatalogError] = useState("");
  const [catalogRetry, setCatalogRetry] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const brandInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const brandSearchRequest = useRef(0);
  const modelSearchRequest = useRef(0);

  useEffect(() => {
    let active = true;
    setDeviceTypesLoading(true);
    getPublicDeviceTypes()
      .then((response) => {
        if (active) {
          setDeviceTypes(response.items);
          setCatalogError("");
        }
      })
      .catch((error) => {
        if (active) setCatalogError(error instanceof Error ? error.message : "We could not load the repair catalog.");
      })
      .finally(() => {
        if (active) setDeviceTypesLoading(false);
      });

    return () => { active = false; };
  }, [catalogRetry]);

  useEffect(() => {
    if (!step1Data.deviceType) {
      setBrandResults([]);
      setBrandHasNext(false);
      setBrandPage(1);
      setBrandLoading(false);
      return;
    }

    const requestId = ++brandSearchRequest.current;
    const controller = new AbortController();
    setBrandLoading(true);
    setCatalogError("");
    const timer = window.setTimeout(() => {
      getPublicManufacturers(step1Data.deviceType!, brandQuery, 1, { signal: controller.signal })
        .then((response) => {
          if (!controller.signal.aborted && requestId === brandSearchRequest.current) {
            setBrandResults(response.items);
            setBrandHasNext(response.has_next);
            setBrandPage(response.page);
          }
        })
        .catch((error) => {
          if (!controller.signal.aborted && requestId === brandSearchRequest.current) setCatalogError(error instanceof Error ? error.message : "We could not load manufacturers.");
        })
        .finally(() => {
          if (!controller.signal.aborted && requestId === brandSearchRequest.current) setBrandLoading(false);
        });
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [brandQuery, step1Data.deviceType, catalogRetry]);

  useEffect(() => {
    if (!step1Data.brand?.id) {
      setModelResults([]);
      setModelHasNext(false);
      setModelPage(1);
      setModelLoading(false);
      return;
    }

    const requestId = ++modelSearchRequest.current;
    const manufacturerId = step1Data.brand.id;
    const controller = new AbortController();
    setModelLoading(true);
    setCatalogError("");
    const timer = window.setTimeout(() => {
      getPublicModels(manufacturerId, modelQuery, 1, { signal: controller.signal })
        .then((response) => {
          if (!controller.signal.aborted && requestId === modelSearchRequest.current) {
            setModelResults(response.items);
            setModelHasNext(response.has_next);
            setModelPage(response.page);
          }
        })
        .catch((error) => {
          if (!controller.signal.aborted && requestId === modelSearchRequest.current) setCatalogError(error instanceof Error ? error.message : "We could not load models.");
        })
        .finally(() => {
          if (!controller.signal.aborted && requestId === modelSearchRequest.current) setModelLoading(false);
        });
    }, 180);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [modelQuery, step1Data.brand?.id, catalogRetry]);

  const updateStep1 = (next: DeviceStepData) => setStep1Data(next);

  const clearBrandSearch = () => {
    brandSearchRequest.current += 1;
    modelSearchRequest.current += 1;
    setBrandQuery("");
    setBrandOpen(true);
    setBrandResults([]);
    setBrandHasNext(false);
    setBrandPage(1);
    setModelResults([]);
    setModelHasNext(false);
    setModelPage(1);
    updateStep1({
      deviceType: step1Data.deviceType,
      deviceTypeLabel: step1Data.deviceTypeLabel,
      deviceIssues: step1Data.deviceIssues,
      brand: undefined,
      model: null,
    });
    brandInputRef.current?.focus();
  };

  const clearModelSearch = () => {
    modelSearchRequest.current += 1;
    setModelQuery("");
    setModelOpen(true);
    setModelResults([]);
    setModelHasNext(false);
    setModelPage(1);
    updateStep1({ ...step1Data, model: null });
    modelInputRef.current?.focus();
  };

  const selectType = (deviceType: PublicDeviceType) => {
    brandSearchRequest.current += 1;
    modelSearchRequest.current += 1;
    const nextStep1 = { deviceType: deviceType.code, deviceTypeLabel: deviceType.label, deviceIssues: deviceType.issues };
    updateStep1(nextStep1);
    setBrandQuery("");
    setModelQuery("");
    setBrandOpen(false);
    setModelOpen(false);
    setBrandResults([]);
    setModelResults([]);
    setBrandHasNext(false);
    setModelHasNext(false);
    setBrandPage(1);
    setModelPage(1);
    setErrors({});
  };

  const selectBrand = (brand: PublicCatalogItem) => {
    modelSearchRequest.current += 1;
    updateStep1({ ...step1Data, brand: { id: brand.id, name: brand.name }, model: null });
    setBrandQuery(brand.name);
    setModelQuery("");
    setBrandOpen(false);
    setModelOpen(false);
    setModelResults([]);
    setModelHasNext(false);
    setModelPage(1);
    setErrors((current) => ({ ...current, brand: "", model: "" }));
    window.setTimeout(() => modelInputRef.current?.focus(), 0);
  };

  const selectModel = (model: PublicCatalogItem) => {
    modelSearchRequest.current += 1;
    updateStep1({ ...step1Data, model: { id: model.id, name: model.name } });
    setModelQuery(model.name);
    setModelOpen(false);
    setErrors((current) => ({ ...current, model: "" }));
  };

  const loadMoreBrands = async () => {
    if (!step1Data.deviceType || !brandHasNext || brandLoading) return;
    const requestId = brandSearchRequest.current;
    const deviceType = step1Data.deviceType;
    const query = brandQuery;
    setBrandLoading(true);
    setCatalogError("");
    try {
      const page = await getPublicManufacturers(deviceType, query, brandPage + 1);
      if (requestId !== brandSearchRequest.current) return;
      setBrandResults((current) => [...current, ...page.items]);
      setBrandHasNext(page.has_next);
      setBrandPage(page.page);
    } catch (error) {
      if (requestId === brandSearchRequest.current) setCatalogError(error instanceof Error ? error.message : "We could not load more manufacturers.");
    } finally {
      if (requestId === brandSearchRequest.current) setBrandLoading(false);
    }
  };

  const loadMoreModels = async () => {
    if (!step1Data.brand?.id || !modelHasNext || modelLoading) return;
    const requestId = modelSearchRequest.current;
    const manufacturerId = step1Data.brand.id;
    const query = modelQuery;
    setModelLoading(true);
    setCatalogError("");
    try {
      const page = await getPublicModels(manufacturerId, query, modelPage + 1);
      if (requestId !== modelSearchRequest.current) return;
      setModelResults((current) => [...current, ...page.items]);
      setModelHasNext(page.has_next);
      setModelPage(page.page);
    } catch (error) {
      if (requestId === modelSearchRequest.current) setCatalogError(error instanceof Error ? error.message : "We could not load more models.");
    } finally {
      if (requestId === modelSearchRequest.current) setModelLoading(false);
    }
  };

  const updateBrandQuery = (value: string) => {
    brandSearchRequest.current += 1;
    modelSearchRequest.current += 1;
    setBrandQuery(value);
    setBrandOpen(true);
    setBrandResults([]);
    setBrandHasNext(false);
    setBrandPage(1);
    setModelResults([]);
    setModelHasNext(false);
    setModelPage(1);
    updateStep1({
      deviceType: step1Data.deviceType,
      deviceTypeLabel: step1Data.deviceTypeLabel,
      deviceIssues: step1Data.deviceIssues,
      brand: undefined,
      model: null,
    });
  };

  const updateModelQuery = (value: string) => {
    modelSearchRequest.current += 1;
    setModelQuery(value);
    setModelOpen(true);
    setModelResults([]);
    setModelHasNext(false);
    setModelPage(1);
    updateStep1({ ...step1Data, model: null });
  };

  const handleNext = () => {
    const nextErrors: Record<string, string> = {};
    if (!step1Data.deviceType) nextErrors.deviceType = "Choose a device type.";
    if (!step1Data.brand) nextErrors.brand = "Choose a manufacturer from the Fixxir catalog.";
    if (step1Data.brand && !step1Data.model) nextErrors.model = "Choose a model from the Fixxir catalog.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.deviceType) document.getElementById("device-type")?.focus();
      else if (nextErrors.brand) brandInputRef.current?.focus();
      else modelInputRef.current?.focus();
      return;
    }
    onChange({
      ...data,
      step1: step1Data,
      ...(data.step1?.deviceType !== step1Data.deviceType ? { step2: { issues: [], details: data.step2?.details } } : {}),
    });
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
    } else if (event.key === "Enter" && open) {
      event.preventDefault();
      if (results.length === 1) {
        if (type === "brand") selectBrand(results[0]);
        else selectModel(results[0]);
      }
    }
  };

  return (
    <div className="space-y-7">
      <Link
        href="/"
        className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Back to home
      </Link>
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Step 1 of 6</p>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">What do you need repaired?</h2>
        <p className="mt-2 text-sm text-gray-600">Choose your device, then select its manufacturer and model from Fixxir&apos;s catalog.</p>
      </div>

      {catalogError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{catalogError}</p>
          <button type="button" onClick={() => setCatalogRetry((value) => value + 1)} className="mt-2 font-semibold underline">Retry catalog load</button>
        </div>
      )}

      <div>
        <label id="device-type" tabIndex={-1} className="mb-3 block text-sm font-semibold text-gray-700">Device type *</label>
        {deviceTypesLoading ? (
          <p className="flex items-center gap-2 text-sm text-gray-600"><Loader2 size={17} className="animate-spin" /> Loading device types…</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {deviceTypes.map((type) => {
              const selected = step1Data.deviceType === type.code;
              const Icon = getDeviceTypeIcon(type.code);
              return (
                <button
                  type="button"
                  key={type.code}
                  onClick={() => selectType(type)}
                  aria-pressed={selected}
                  className={`flex min-h-16 items-center justify-center gap-2 rounded-xl border-2 px-4 font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-600 ${selected ? "border-blue-600 bg-blue-50 text-blue-600" : "border-gray-200 text-gray-700 hover:border-blue-300"}`}
                >
                  <Icon size={23} aria-hidden="true" />{type.label}
                </button>
              );
            })}
          </div>
        )}
        {!deviceTypesLoading && deviceTypes.length === 0 && <p className="mt-3 text-sm text-gray-600">No device types are currently available in Fixxir&apos;s catalog.</p>}
        {errors.deviceType && <p className="mt-2 text-sm text-red-600" role="alert">{errors.deviceType}</p>}
      </div>

      {step1Data.deviceType && (
        <div className="space-y-7">
          <div className="relative">
            <label htmlFor="brand-search" className="mb-2 block text-sm font-semibold text-gray-700">Manufacturer *</label>
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={brandInputRef}
                id="brand-search"
                role="combobox"
                aria-expanded={brandOpen}
                aria-controls="brand-results"
                aria-autocomplete="list"
                value={brandQuery}
                onFocus={() => setBrandOpen(true)}
                onChange={(event) => updateBrandQuery(event.target.value)}
                onKeyDown={(event) => handleInputKeyDown(event, "brand")}
                placeholder={`Search ${step1Data.deviceTypeLabel?.toLowerCase() || "device"} manufacturer`}
                className="min-h-12 w-full rounded-xl border-2 border-gray-200 bg-white pl-11 pr-20 outline-none transition focus:border-blue-600"
              />
              {brandLoading && <Loader2 size={18} className="absolute right-12 top-1/2 -translate-y-1/2 animate-spin text-blue-600" />}
              {brandOpen && brandQuery.trim() && <button type="button" onClick={clearBrandSearch} aria-label="Clear manufacturer search" title="Clear search" className="absolute right-1 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"><X size={18} aria-hidden="true" /></button>}
              {step1Data.brand && !brandOpen && <Check size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" />}
            </div>
            {brandOpen && (
              <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                <div id="brand-results" role="listbox" aria-busy={brandLoading}>
                  {brandResults.map((brand, index) => (
                    <button type="button" role="option" aria-selected={step1Data.brand?.id === brand.id} id={`brand-option-${index}`} key={brand.id} onClick={() => selectBrand(brand)} className="flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-gray-800 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none">{brand.name}</button>
                  ))}
                </div>
                {brandResults.length === 0 && !brandLoading && <p className="px-3 py-3 text-sm text-gray-500">{brandQuery.trim() ? "No matching manufacturer in Fixxir’s catalog. Contact us if you need help." : "No manufacturers are currently available for this device type."}</p>}
                {brandHasNext && <button type="button" onClick={loadMoreBrands} disabled={brandLoading} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border-t border-gray-100 px-3 text-sm font-semibold text-blue-600 disabled:opacity-60">{brandLoading && <Loader2 size={15} className="animate-spin" />}Load more manufacturers</button>}
              </div>
            )}
            {errors.brand && <p className="mt-2 text-sm text-red-600" role="alert">{errors.brand}</p>}
          </div>

          {step1Data.brand && (
            <div className="relative">
              <label htmlFor="model-search" className="mb-2 block text-sm font-semibold text-gray-700">Model *</label>
              <div className="relative">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  ref={modelInputRef}
                  id="model-search"
                  role="combobox"
                  aria-expanded={modelOpen}
                  aria-controls="model-results"
                  aria-autocomplete="list"
                  value={modelQuery}
                  onFocus={() => setModelOpen(true)}
                  onChange={(event) => updateModelQuery(event.target.value)}
                  onKeyDown={(event) => handleInputKeyDown(event, "model")}
                  placeholder="Search your model"
                  className="min-h-12 w-full rounded-xl border-2 border-gray-200 bg-white pl-11 pr-20 outline-none transition focus:border-blue-600"
                />
                {modelLoading && <Loader2 size={18} className="absolute right-12 top-1/2 -translate-y-1/2 animate-spin text-blue-600" />}
                {modelOpen && modelQuery.trim() && <button type="button" onClick={clearModelSearch} aria-label="Clear model search" title="Clear search" className="absolute right-1 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600"><X size={18} aria-hidden="true" /></button>}
                {step1Data.model && !modelOpen && <Check size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600" />}
              </div>
              {modelOpen && (
                <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                  <div id="model-results" role="listbox" aria-busy={modelLoading}>
                    {modelResults.map((model, index) => (
                      <button type="button" role="option" aria-selected={step1Data.model?.id === model.id} id={`model-option-${index}`} key={model.id} onClick={() => selectModel(model)} className="flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-gray-800 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none">{model.name}</button>
                    ))}
                  </div>
                  {modelResults.length === 0 && !modelLoading && <p className="px-3 py-3 text-sm text-gray-500">{modelQuery.trim() ? "No matching model in Fixxir’s catalog. Contact us if you need help." : "No models are currently available for this manufacturer."}</p>}
                  {modelHasNext && <button type="button" onClick={loadMoreModels} disabled={modelLoading} className="flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border-t border-gray-100 px-3 text-sm font-semibold text-blue-600 disabled:opacity-60">{modelLoading && <Loader2 size={15} className="animate-spin" />}Load more models</button>}
                </div>
              )}
              {errors.model && <p className="mt-2 text-sm text-red-600" role="alert">{errors.model}</p>}
            </div>
          )}
        </div>
      )}

      <button type="button" onClick={handleNext} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">Continue <ChevronRight size={20} /></button>
    </div>
  );
}

// Step 2: Problem Description
type IssueOption = { label: string; icon: LucideIcon };

function Step2Problem({ data, onNext, onPrev, onChange }: StepNavigationProps) {
  const [step2Data, setStep2Data] = useState(data?.step2 || {});
  const [detailsError, setDetailsError] = useState("");

  const issueLabels = [...new Set([...(data?.step1?.deviceIssues || []), "Other", "Not sure"])];
  const issueOptions: IssueOption[] = issueLabels.map((label) => ({ label, icon: getIssueIcon(label) }));
  const selectedIssues = step2Data.issues || [];
  const otherSelected = selectedIssues.includes("Other");

  const toggleIssue = (label: string) => {
    if (label === "Other") setDetailsError("");
    setStep2Data((prev) => {
      const current = prev.issues || [];
      return {
        ...prev,
        issues: current.includes(label)
          ? current.filter((item) => item !== label)
          : [...current, label],
      };
    });
  };

  const handleNext = () => {
    if (selectedIssues.length === 0) {
      alert("Please select at least one issue");
      return;
    }
    if (otherSelected && !step2Data.details?.trim()) {
      setDetailsError("Please describe the issue when selecting Other.");
      return;
    }
    setDetailsError("");
    onChange({ ...data, step2: step2Data });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">What is happening with your device?</h2>
        <p className="mt-1 text-sm text-gray-600">Select all that apply.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {issueOptions.map((option) => {
          const Icon = option.icon;
          const selected = selectedIssues.includes(option.label);
          const isScreenIssue = /screen|display/i.test(option.label);
          return (
            <button key={option.label} type="button" onClick={() => toggleIssue(option.label)} aria-pressed={selected} className={`relative flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition ${selected ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"}`}>
              {selected && <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white"><Check size={12} /></span>}
              {isScreenIssue ? <ScreenDamageIcon deviceType={data?.step1?.deviceType || ""} /> : <Icon size={30} className="text-blue-600" />}
              <span className="text-sm leading-tight">{option.label}</span>
            </button>
          );
        })}
      </div>

      <div>
        <label htmlFor="repair-issue-details" className="mb-2 block text-sm font-semibold text-gray-700">Tell us more{otherSelected ? " *" : " (optional)"}</label>
        <textarea id="repair-issue-details" required={otherSelected} aria-invalid={Boolean(detailsError)} aria-describedby={detailsError ? "repair-issue-details-error" : undefined} value={step2Data.details || ""} onChange={(event) => { setStep2Data({ ...step2Data, details: event.target.value }); if (event.target.value.trim()) setDetailsError(""); }} placeholder={otherSelected ? "Describe the issue..." : "Add any additional details about the problem..."} className={`w-full rounded-lg border-2 px-3 py-2 outline-none focus:border-blue-600 ${detailsError ? "border-red-500" : "border-gray-300"}`} rows={4} />
        {detailsError && <p id="repair-issue-details-error" role="alert" className="mt-2 text-sm text-red-600">{detailsError}</p>}
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-gray-700">Want to share photos of the issue? Send them to Fixxir on <a href={getFixxirWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 underline">WhatsApp</a>. Photo uploads through this form are not available yet.</p>
      </div>

      <div className="flex gap-3">
        <button onClick={onPrev} className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"><ChevronLeft size={20} /> Back</button>
        <button onClick={handleNext} disabled={issueOptions.length === 0} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">Continue <ChevronRight size={20} /></button>
      </div>
    </div>
  );
}

// Step 3: Customer Info
function Step3CustomerInfo({ data, onNext, onPrev, onChange }: StepNavigationProps) {
  const [step3Data, setStep3Data] = useState(data?.step3 || {});

  const handleNext = () => {
    const email = step3Data.email?.trim() || "";
    const firstName = step3Data.firstName?.trim() || "";
    const lastName = step3Data.lastName?.trim() || "";
    const phone = step3Data.phone?.trim() || "";
    if (!firstName || !lastName || !phone) {
      alert("Please fill in first name, last name, and phone number");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
    onChange({ ...data, step3: { ...step3Data, firstName, lastName, phone, email } });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Your contact information</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="repair-first-name" className="mb-2 block text-sm font-semibold text-gray-700">First name *</label>
          <input id="repair-first-name" autoComplete="given-name" value={step3Data.firstName || ""} onChange={(event) => setStep3Data({ ...step3Data, firstName: event.target.value })} placeholder="First name" className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 outline-none focus:border-blue-600" />
        </div>
        <div>
          <label htmlFor="repair-last-name" className="mb-2 block text-sm font-semibold text-gray-700">Last name *</label>
          <input id="repair-last-name" autoComplete="family-name" value={step3Data.lastName || ""} onChange={(event) => setStep3Data({ ...step3Data, lastName: event.target.value })} placeholder="Last name" className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 outline-none focus:border-blue-600" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone / WhatsApp *</label>
        <input
          type="tel"
          value={step3Data.phone || ""}
          onChange={(e) => setStep3Data({ ...step3Data, phone: e.target.value })}
          placeholder="Your phone or WhatsApp number"
          className="w-full py-2 px-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none"
        />
        <p className="text-xs text-gray-600 mt-1">We&apos;ll use this to contact you about your repair</p>
      </div>

      <div>
        <label htmlFor="repair-email" className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
        <input
          id="repair-email"
          type="email"
          required
          autoComplete="email"
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
  const today = new Date();
  const minimumCollectionDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const handoffOptions = [
    { value: "pickup", label: "Pickup — Fixxir collects from my address" },
    { value: "dropoff", label: `I will drop it off — contact us first (${FIXXIR_BUSINESS_ADDRESS})` },
  ];

  const handleNext = () => {
    if (!step4Data.area || !step4Data.state || !step4Data.handoff) {
      alert("Please enter your city, state, and handoff preference");
      return;
    }
    if (step4Data.handoff === "pickup" && (!step4Data.address?.trim() || !step4Data.collectionDate || !step4Data.collectionWindow)) {
      alert("Pickup needs an address, date, and time window");
      return;
    }
    onChange({ ...data, step4: step4Data });
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Where is your device?</h2>

      <div>
        <label htmlFor="repair-area" className="block text-sm font-semibold text-gray-700 mb-3">City / area *</label>
        <input
          id="repair-area"
          value={step4Data.area || ""}
          onChange={(event) => setStep4Data({ ...step4Data, area: event.target.value })}
          placeholder="Lagos, Ikeja"
          className="w-full py-2 px-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none"
        />
      </div>

      <div>
        <label htmlFor="repair-state" className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
        <select id="repair-state" value={step4Data.state || ""} onChange={(event) => setStep4Data({ ...step4Data, state: event.target.value })} className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-3 focus:border-blue-600 outline-none">
          <option value="">Choose a state</option><option value="Lagos">Lagos</option><option value="FCT">FCT (Abuja)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Street address {step4Data.handoff === "pickup" ? "*" : "(optional)"}</label>
        <input
          type="text"
          value={step4Data.address || ""}
          onChange={(e) => setStep4Data({ ...step4Data, address: e.target.value })}
          placeholder="Street and area"
          required={step4Data.handoff === "pickup"}
          className="w-full py-2 px-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 outline-none"
        />
      </div>

      {step4Data.handoff === "pickup" && <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="collection-date" className="mb-2 block text-sm font-semibold text-gray-700">Preferred pickup date *</label><input id="collection-date" type="date" min={minimumCollectionDate} value={step4Data.collectionDate || ""} onChange={(event) => setStep4Data({ ...step4Data, collectionDate: event.target.value })} className="w-full rounded-lg border-2 border-gray-300 px-3 py-3 focus:border-blue-600 outline-none" /></div>
        <div><label htmlFor="collection-window" className="mb-2 block text-sm font-semibold text-gray-700">Preferred time window *</label><select id="collection-window" value={step4Data.collectionWindow || ""} onChange={(event) => setStep4Data({ ...step4Data, collectionWindow: event.target.value })} className="w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-3 focus:border-blue-600 outline-none"><option value="">Choose a time</option><option>8:00 AM - 11:00 AM</option><option>12:00 PM - 2:00 PM</option><option>2:00 PM - 5:00 PM</option></select></div>
      </div>}

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
          <strong>Note:</strong> We&apos;ll confirm handoff availability and any applicable fees before scheduling.
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
  submitting: boolean;
  submitError: string;
}

function Step6Review({ data, onSubmit, onPrev, submitting, submitError }: ReviewProps) {
  const handleSubmit = () => {
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Review your repair request</h2>

      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Device</p>
          <p className="text-lg font-semibold text-gray-900">
            {data?.step1?.deviceTypeLabel || "Device type not specified"}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            {data?.step1?.brand?.name || "Manufacturer not specified"} — {data?.step1?.model?.name || "Model not specified"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Problem</p>
          <p className="text-lg font-semibold text-gray-900">{data?.step2?.issues?.join(", ")}</p>
        </div>

        <div>
          <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Contact</p>
          <p className="text-lg font-semibold text-gray-900">{[data?.step3?.firstName, data?.step3?.lastName].filter(Boolean).join(" ")}</p>
          <p className="text-sm text-gray-600">{data?.step3?.phone}</p>
          <p className="text-sm text-gray-600">{data?.step3?.email}</p>
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

      {submitError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{submitError}</p>}

      <div className="flex gap-3">
        <button
          onClick={onPrev}
          className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-wait disabled:opacity-60"
        >
          {submitting ? "Sending request…" : "Submit repair request"}
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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const totalSteps = 6;

  useEffect(() => {
    // Tag the current page entry so Back from step 2 returns to step 1.
    writeRepairWizardStepToHistory(1, true);

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as Record<string, unknown> | null;
      const step = state?.[repairWizardStepHistoryKey];
      if (typeof step !== "number" || !Number.isInteger(step) || step < 1 || step > totalSteps) return;

      setCurrentStep(step);
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [totalSteps]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      writeRepairWizardStepToHistory(nextStep);
      setCurrentStep(nextStep);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const step1 = formData.step1;
      const step2 = formData.step2;
      const step3 = formData.step3;
      const step4 = formData.step4;
      if (!step1?.model?.id) {
        throw new PublicApiError("Choose a model from Fixxir’s catalog before submitting.", 422);
      }
      if (!step1?.deviceType || !step1.brand?.id || !step2?.issues?.length || !step3?.firstName || !step3.lastName || !step3.phone || !step3.email || !step4?.area || !step4.state || !step4.handoff) {
        throw new PublicApiError("Please go back and complete all required details.", 422);
      }

      const firstName = step3.firstName.trim();
      const lastName = step3.lastName.trim();
      const fullName = `${firstName} ${lastName}`;
      const urgencyLabels: Record<string, string> = { asap: "As soon as possible", "1-2days": "Within 1–2 days", week: "This week", nourgency: "No urgent deadline" };
      const intake = {
        first_name: firstName,
        last_name: lastName,
        email: step3.email.trim(),
        phone: step3.phone.trim(),
        whatsapp_phone: step3.phone.trim(),
        model_id: step1.model.id,
        description: [step2.issues.join(", "), step2.details?.trim(), formData.step5?.urgency ? `Requested timing: ${urgencyLabels[formData.step5.urgency] || formData.step5.urgency}` : ""].filter(Boolean).join(" — "),
        collection_handoff_method: step4.handoff === "pickup" ? "courier_pickup" : "customer_dropoff",
        return_handoff_method: "customer_pickup",
        collection_recipient_name: fullName,
        collection_recipient_phone: step3.phone.trim(),
        collection_address_line_1: step4.address?.trim() || "",
        collection_city: step4.area.trim(),
        collection_state: step4.state,
        collection_country_code: "NG",
        collection_availability_date: step4.collectionDate || "",
        collection_availability_window_label: step4.collectionWindow || "",
        return_recipient_name: fullName,
        return_recipient_phone: step3.phone.trim(),
        return_city: step4.area.trim(),
        return_state: step4.state,
        return_country_code: "NG",
      };
      const summary = await publicApi<{ token: string }>("/public/repairs/summary", { method: "POST", body: JSON.stringify(intake) });
      const created = await publicApi<{ public_lookup_code: string }>("/public/repairs", { method: "POST", body: JSON.stringify({ ...intake, submission_token: summary.token }) });
      if (!created.public_lookup_code) throw new PublicApiError("The request was saved, but we could not open its tracking page. Please contact Fixxir.", 502);
      router.push(`/repair/request/success?lookup=${encodeURIComponent(created.public_lookup_code)}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "We could not submit your request. Please try again.");
      setSubmitting(false);
    }
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
          {currentStep === 6 && <Step6Review data={formData} onSubmit={handleSubmit} onPrev={handlePrev} submitting={submitting} submitError={submitError} />}
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Questions? Contact us on{" "}
          <a
            href={getFixxirWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 font-semibold hover:underline"
          >
            WhatsApp ({FIXXIR_PHONE_DISPLAY})
          </a>
          <span className="ml-2">Support hours: {FIXXIR_SUPPORT_HOURS}</span>
          <a href={`tel:${FIXXIR_PHONE_LINK}`} className="ml-2 text-blue-600 font-semibold hover:underline">Call {FIXXIR_PHONE_DISPLAY}</a>
        </p>
      </div>
    </div>
  );
}
