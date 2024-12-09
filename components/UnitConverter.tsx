/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect } from 'react';
import { ChevronsUpDown, RefreshCcw, InfoIcon, Layers, Ruler, Thermometer, Scale, Droplet } from 'lucide-react';

interface MeasurementType {
  label: string;
  value: string;
  conversionUnits: ConversionUnit[];
}

interface ConversionUnit {
  label: string;
  value: string;
  baseUnitConversion: number;
}

const UnitConverter: React.FC = () => {
  const [selectedType, setSelectedType] = useState<MeasurementType | null>(null);
  const [fromUnit, setFromUnit] = useState<ConversionUnit | null>(null);
  const [toUnit, setToUnit] = useState<ConversionUnit | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [convertedValue, setConvertedValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const measurementTypes: MeasurementType[] = [
    {
      label: 'Liquid Volume',
      value: 'liquid',
      conversionUnits: [
        { label: 'Milliliters', value: 'ml', baseUnitConversion: 1 },
        { label: 'Liters', value: 'l', baseUnitConversion: 1000 },
        { label: 'Fluid Ounces', value: 'fl oz', baseUnitConversion: 29.5735 },
        { label: 'Cups', value: 'cup', baseUnitConversion: 236.588 },
        { label: 'Tablespoons', value: 'tbsp', baseUnitConversion: 14.7868 },
        { label: 'Teaspoons', value: 'tsp', baseUnitConversion: 4.92892 },
        { label: 'Gallons', value: 'gal', baseUnitConversion: 3785.41 },
        { label: 'Pints', value: 'pt', baseUnitConversion: 473.176 },
        { label: 'Milliliters', value: 'ml', baseUnitConversion: 1 }
      ]
    },
    {
      label: 'Weight/Mass',
      value: 'solid',
      conversionUnits: [
        { label: 'Grams', value: 'g', baseUnitConversion: 1 },
        { label: 'Kilograms', value: 'kg', baseUnitConversion: 1000 },
        { label: 'Milligrams', value: 'mg', baseUnitConversion: 0.001 },
        { label: 'Ounces', value: 'oz', baseUnitConversion: 28.3495 },
        { label: 'Pounds', value: 'lb', baseUnitConversion: 453.592 },
        { label: 'Metric Tons', value: 'ton', baseUnitConversion: 1000000 },
        { label: 'Carats', value: 'ct', baseUnitConversion: 0.2 },
        { label: 'Stone', value: 'st', baseUnitConversion: 6350.29 }
      ]
    },
    {
      label: 'Length',
      value: 'length',
      conversionUnits: [
        { label: 'Millimeters', value: 'mm', baseUnitConversion: 1 },
        { label: 'Centimeters', value: 'cm', baseUnitConversion: 10 },
        { label: 'Meters', value: 'm', baseUnitConversion: 1000 },
        { label: 'Inches', value: 'in', baseUnitConversion: 25.4 },
        { label: 'Feet', value: 'ft', baseUnitConversion: 304.8 },
        { label: 'Yards', value: 'yd', baseUnitConversion: 914.4 },
        { label: 'Kilometers', value: 'km', baseUnitConversion: 1000000 },
        { label: 'Miles', value: 'mi', baseUnitConversion: 1609344 }
      ]
    },
    {
      label: 'Temperature',
      value: 'temp',
      conversionUnits: [
        { label: 'Celsius', value: 'C', baseUnitConversion: 1 },
        { label: 'Fahrenheit', value: 'F', baseUnitConversion: 1 },
        { label: 'Kelvin', value: 'K', baseUnitConversion: 1 }
      ]
    },
    {
      label: 'Area',
      value: 'area',
      conversionUnits: [
        { label: 'Square Meters', value: 'm²', baseUnitConversion: 1 },
        { label: 'Square Kilometers', value: 'km²', baseUnitConversion: 1000000 },
        { label: 'Hectares', value: 'ha', baseUnitConversion: 10000 },
        { label: 'Acres', value: 'acre', baseUnitConversion: 4046.86 },
        { label: 'Square Feet', value: 'ft²', baseUnitConversion: 0.092903 },
        { label: 'Square Inches', value: 'in²', baseUnitConversion: 0.00064516 }
      ]
    }
  ];

  const categoryIcons = {
    liquid: <Droplet className="text-blue-500" />,
    solid: <Scale className="text-green-500" />,
    length: <Ruler className="text-purple-500" />,
    temp: <Thermometer className="text-red-500" />,
    area: <Layers className="text-teal-500" />
  };

  useEffect(() => {
    calculateConversion();
  }, [inputValue, fromUnit, toUnit]);

  const handleTypeChange = (type: MeasurementType) => {
    setSelectedType(type);
    setFromUnit(type.conversionUnits[0]);
    setToUnit(type.conversionUnits[1] || type.conversionUnits[0]);
    setInputValue('');
    setConvertedValue('');
    setError('');
  };

  const swapUnits = () => {
    if (fromUnit && toUnit) {
      const temp = fromUnit;
      setFromUnit(toUnit);
      setToUnit(temp);
    }
  };

  const calculateConversion = () => {
    setError('');
    setConvertedValue('');

    if (!inputValue) return;
    if (!selectedType || !fromUnit || !toUnit) {
      setError('Please select measurement type and units');
      return;
    }

    try {
      const numericValue = parseFloat(inputValue);
      
      if (isNaN(numericValue)) {
        setError('Please enter a valid number');
        return;
      }

      // Special handling for temperature conversions
      if (selectedType.value === 'temp') {
        let convertedTemp: number;
        if (fromUnit.value === 'C' && toUnit.value === 'F') {
          convertedTemp = (numericValue * 9/5) + 32;
        } else if (fromUnit.value === 'F' && toUnit.value === 'C') {
          convertedTemp = (numericValue - 32) * 5/9;
        } else if (fromUnit.value === 'C' && toUnit.value === 'K') {
          convertedTemp = numericValue + 273.15;
        } else if (fromUnit.value === 'K' && toUnit.value === 'C') {
          convertedTemp = numericValue - 273.15;
        } else if (fromUnit.value === 'F' && toUnit.value === 'K') {
          convertedTemp = (numericValue - 32) * 5/9 + 273.15;
        } else if (fromUnit.value === 'K' && toUnit.value === 'F') {
          convertedTemp = (numericValue - 273.15) * 9/5 + 32;
        } else {
          convertedTemp = numericValue;
        }
        setConvertedValue(convertedTemp.toFixed(2).replace(/\.?0+$/, ''));
        return;
      }

      // Standard conversion for other unit types
      const baseValue = numericValue * fromUnit.baseUnitConversion;
      const convertedResult = baseValue / toUnit.baseUnitConversion;

      setConvertedValue(convertedResult.toFixed(4).replace(/\.?0+$/, ''));
    } catch (err) {
      setError('Conversion error');
    }
  };

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
<div className="max-w-md mx-auto p-8 bg-gradient-to-br from-sky-100 to-sky-200 shadow-2xl rounded-3xl border-4 border-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-400 to-blue-500"></div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-black text-blue-900 tracking-tight">
          Unit Converter
        </h1>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="text-blue-600 hover:text-blue-800 transition-all"
        >
          <InfoIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Type Selection with Icons */}
      <div className="grid grid-cols-5 gap-2 mb-6">
        {measurementTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => handleTypeChange(type)}
            className={`p-3 rounded-xl transition-all flex flex-col items-center justify-center 
              ${selectedType?.value === type.value 
                ? 'bg-white shadow-lg scale-105 border-2 border-blue-300' 
                : 'bg-sky-100 hover:bg-white hover:shadow-md'}`}
          >
            {categoryIcons[type.value as keyof typeof categoryIcons]}
            <span className="text-xs mt-1 text-gray-600">{type.label}</span>
          </button>
        ))}
      </div>

      {/* Units and Swap Section */}
      {selectedType && (
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mb-4">
          {/* From Unit */}
          <div>
            <label className="block mb-2 text-blue-900 font-semibold">From</label>
            <select
              value={fromUnit?.value || ''}
              onChange={(e) =>
                setFromUnit(
                  selectedType.conversionUnits.find((unit) => unit.value === e.target.value)!
                )
              }
              className="w-full p-3 border-2 border-blue-300 rounded-lg text-blue-900 font-medium"
            >
              {selectedType.conversionUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex items-end pb-1">
            <button 
              onClick={swapUnits}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors flex items-center justify-center"
              title="Swap Units"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>

          {/* To Unit */}
          <div>
            <label className="block mb-2 text-blue-900 font-semibold">To</label>
            <select
              value={toUnit?.value || ''}
              onChange={(e) =>
                setToUnit(
                  selectedType.conversionUnits.find((unit) => unit.value === e.target.value)!
                )
              }
              className="w-full p-3 border-2 border-blue-300 rounded-lg text-blue-900 font-medium"
            >
              {selectedType.conversionUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="mb-4">
        <label htmlFor="input" className="block mb-2 text-blue-900 font-semibold">
          Input Value
        </label>
        <input
          id="input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number"
          className="w-full p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900"
        />
      </div>

      {/* Error Handling */}
      {error && (
        <div className="text-red-600 text-center mb-4 bg-red-100 p-2 rounded">
          {error}
        </div>
      )}

      {/* Conversion Result */}
      {convertedValue && !error && (
        <div className="text-center bg-blue-100 p-4 rounded-lg shadow-inner">
          <p className="text-xl font-bold text-blue-800">
            {inputValue} {fromUnit?.label} = {convertedValue} {toUnit?.label}
          </p>
        </div>
      )}
    </div>
  );
};

export default UnitConverter;