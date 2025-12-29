"use client";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const DATA_COUNT = 100;
  const [initialArray, setInitialArray] = useState<number[]>([]);
  const [bubbleArray, setBubbleArray] = useState<number[]>([]);
  const [mergeArray, setMergeArray] = useState<number[]>([]);
  const [quickArray, setQuickArray] = useState<number[]>([]);
  
  const [isSorting, setIsSorting] = useState(false);
  const [bubbleMetrics, setBubbleMetrics] = useState({ time: 0, count: 0 });
  const [mergeMetrics, setMergeMetrics] = useState({ time: 0, count: 0 });
  const [quickMetrics, setQuickMetrics] = useState({ time: 0, count: 0 });
  
  const [bubbleComparing, setBubbleComparing] = useState<number[]>([]);
  const [mergeComparing, setMergeComparing] = useState<number[]>([]);
  const [quickComparing, setQuickComparing] = useState<number[]>([]);

  const generateNewData = () => {
    const newArr = Array.from({ length: DATA_COUNT }, () => Math.floor(Math.random() * 95) + 5);
    setInitialArray(newArr);
    setBubbleArray([...newArr]);
    setMergeArray([...newArr]);
    setQuickArray([...newArr]);
    setBubbleMetrics({ time: 0, count: 0 });
    setMergeMetrics({ time: 0, count: 0 });
    setQuickMetrics({ time: 0, count: 0 });
  };

  useEffect(() => { generateNewData(); }, []);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // --- Bubble Sort ---
  const runBubble = async (arr: number[]) => {
    let count = 0; const start = performance.now();
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setBubbleComparing([j, j + 1]); count++;
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setBubbleArray([...arr]); await sleep(1);
        }
      }
    }
    setBubbleMetrics({ time: Math.round(performance.now() - start), count });
    setBubbleComparing([]);
  };

  // --- Merge Sort ---
  const runMerge = async (arr: number[]) => {
    let count = 0; const start = performance.now();
    const merge = async (s: number, m: number, e: number) => {
      let l = arr.slice(s, m + 1), r = arr.slice(m + 1, e + 1);
      let i = 0, j = 0, k = s;
      while (i < l.length && j < r.length) {
        setMergeComparing([s + i, m + 1 + j]); count++;
        arr[k++] = l[i] <= r[j] ? l[i++] : r[j++];
        setMergeArray([...arr]); await sleep(1);
      }
      while (i < l.length) { arr[k++] = l[i++]; setMergeArray([...arr]); await sleep(1); }
      while (j < r.length) { arr[k++] = r[j++]; setMergeArray([...arr]); await sleep(1); }
    };
    const sort = async (s: number, e: number) => {
      if (s >= e) return;
      const m = Math.floor((s + e) / 2);
      await sort(s, m); await sort(m + 1, e); await merge(s, m, e);
    };
    await sort(0, arr.length - 1);
    setMergeMetrics({ time: Math.round(performance.now() - start), count });
    setMergeComparing([]);
  };

  // --- Quick Sort ---
  const runQuick = async (arr: number[]) => {
    let count = 0; const start = performance.now();
    const partition = async (low: number, high: number) => {
      let pivot = arr[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        setQuickComparing([j, high]); count++;
        if (arr[j] < pivot) {
          i++; [arr[i], arr[j]] = [arr[j], arr[i]];
          setQuickArray([...arr]); await sleep(5);
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setQuickArray([...arr]); await sleep(5);
      return i + 1;
    };
    const sort = async (low: number, high: number) => {
      if (low < high) {
        let pi = await partition(low, high);
        await sort(low, pi - 1); await sort(pi + 1, high);
      }
    };
    await sort(0, arr.length - 1);
    setQuickMetrics({ time: Math.round(performance.now() - start), count });
    setQuickComparing([]);
  };

  const startBattle = () => {
    setIsSorting(true);
    Promise.all([
      runBubble([...bubbleArray]),
      runMerge([...mergeArray]),
      runQuick([...quickArray])
    ]).then(() => setIsSorting(false));
  };

  return (
    <main className="p-4 max-w-7xl mx-auto font-sans bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-black text-center mb-8 text-slate-800 uppercase tracking-tighter italic">The Triple Threat Battle</h1>
      
      <div className="flex justify-center mb-8">
        <button onClick={startBattle} disabled={isSorting} className="px-16 py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition-all disabled:opacity-30">
          {isSorting ? "SORTING..." : "FIGHT!"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Visualizer title="Bubble Sort" complexity="O(n^2)" metrics={bubbleMetrics} array={bubbleArray} comparing={bubbleComparing} color="bg-slate-400" />
        <Visualizer title="Merge Sort" complexity="O(n log n)" metrics={mergeMetrics} array={mergeArray} comparing={mergeComparing} color="bg-indigo-600" />
        <Visualizer title="Quick Sort" complexity="O(n log n)" metrics={quickMetrics} array={quickArray} comparing={quickComparing} color="bg-emerald-500" />
      </div>

      <button onClick={generateNewData} disabled={isSorting} className="block mx-auto mt-10 text-slate-400 hover:text-slate-600 underline text-sm italic">Generate Random Data</button>
    </main>
  );
}

// 共通のグラフ表示パーツ
function Visualizer({ title, complexity, metrics, array, comparing, color }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg border-b-8 border-slate-200">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className={`font-bold italic ${color.replace('bg-', 'text-')}`}>{title}</h2>
          <p className="text-[10px] text-slate-400 font-mono">{complexity}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 italic">TIME: {metrics.time}ms</p>
          <p className="text-[10px] font-bold text-slate-400 italic">COMPS: {metrics.count}</p>
        </div>
      </div>
      <div className="flex items-end h-32 gap-[1px] bg-slate-50 p-1 rounded">
        {array.map((v: any, i: any) => (
          <div key={i} style={{ height: `${v}%` }} className={`flex-1 ${comparing.includes(i) ? 'bg-red-500' : color}`} />
        ))}
      </div>
    </div>
  );
}