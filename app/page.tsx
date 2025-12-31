"use client";
import React, { useState, useEffect } from 'react';

export default function Home() {
  const DATA_COUNT = 100;
  const [initialArray, setInitialArray] = useState<number[]>([]);
  const [bubbleArray, setBubbleArray] = useState<number[]>([]);
  const [mergeArray, setMergeArray] = useState<number[]>([]);
  const [quickArray, setQuickArray] = useState<number[]>([]);
  const [selectionArray, setSelectionArray] = useState<number[]>([]);
  const [insertionArray, setInsertionArray] = useState<number[]>([]);
  const [heapArray, setHeapArray] = useState<number[]>([]);
  
  const [isSorting, setIsSorting] = useState(false);
  const [bubbleMetrics, setBubbleMetrics] = useState({ time: 0, count: 0 });
  const [mergeMetrics, setMergeMetrics] = useState({ time: 0, count: 0 });
  const [quickMetrics, setQuickMetrics] = useState({ time: 0, count: 0 });
  const [selectionMetrics, setSelectionMetrics] = useState({ time: 0, count: 0 });
  const [insertionMetrics, setInsertionMetrics] = useState({ time: 0, count: 0 });
  const [heapMetrics, setHeapMetrics] = useState({ time: 0, count: 0 });
  
  const [bubbleComparing, setBubbleComparing] = useState<number[]>([]);
  const [mergeComparing, setMergeComparing] = useState<number[]>([]);
  const [quickComparing, setQuickComparing] = useState<number[]>([]);
  const [selectionComparing, setSelectionComparing] = useState<number[]>([]);
  const [insertionComparing, setInsertionComparing] = useState<number[]>([]);
  const [heapComparing, setHeapComparing] = useState<number[]>([]);
  const [winner, setWinner] = useState<string | null>(null);

  const generateNewData = () => {
    const newArr = Array.from({ length: DATA_COUNT }, () => Math.floor(Math.random() * 95) + 5);
    setInitialArray(newArr);
    setBubbleArray([...newArr]);
    setMergeArray([...newArr]);
    setQuickArray([...newArr]);
    setSelectionArray([...newArr]);
    setInsertionArray([...newArr]);
    setHeapArray([...newArr]);
    setBubbleMetrics({ time: 0, count: 0 });
    setMergeMetrics({ time: 0, count: 0 });
    setQuickMetrics({ time: 0, count: 0 });
    setSelectionMetrics({ time: 0, count: 0 });
    setInsertionMetrics({ time: 0, count: 0 });
    setHeapMetrics({ time: 0, count: 0 });
    setWinner(null);
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
    const time = Math.round(performance.now() - start);
    setBubbleMetrics({ time, count });
    setBubbleComparing([]);
    return { name: 'Bubble Sort', time };
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
    const time = Math.round(performance.now() - start);
    setMergeMetrics({ time, count });
    setMergeComparing([]);
    return { name: 'Merge Sort', time };
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
    const time = Math.round(performance.now() - start);
    setQuickMetrics({ time, count });
    setQuickComparing([]);
    return { name: 'Quick Sort', time };
  };

  // --- Selection Sort ---
  const runSelection = async (arr: number[]) => {
    let count = 0; const start = performance.now();
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        setSelectionComparing([minIdx, j]); count++;
        if (arr[j] < arr[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setSelectionArray([...arr]); await sleep(20);
      }
    }
    const time = Math.round(performance.now() - start);
    setSelectionMetrics({ time, count });
    setSelectionComparing([]);
    return { name: 'Selection Sort', time };
  };

  // --- Insertion Sort ---
  const runInsertion = async (arr: number[]) => {
    let count = 0; const start = performance.now();
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i], j = i - 1;
      while (j >= 0) {
        setInsertionComparing([j, j + 1]); count++;
        if (arr[j] > key) {
          arr[j + 1] = arr[j];
          setInsertionArray([...arr]); await sleep(1);
          j--;
        } else break;
      }
      arr[j + 1] = key;
      setInsertionArray([...arr]);
    }
    const time = Math.round(performance.now() - start);
    setInsertionMetrics({ time, count });
    setInsertionComparing([]);
    return { name: 'Insertion Sort', time };
  };

  // --- Heap Sort ---
  const runHeap = async (arr: number[]) => {
    let count = 0; const start = performance.now();
    const heapify = async (n: number, i: number) => {
      let largest = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < n) { setHeapComparing([l, largest]); count++; if (arr[l] > arr[largest]) largest = l; }
      if (r < n) { setHeapComparing([r, largest]); count++; if (arr[r] > arr[largest]) largest = r; }
      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        setHeapArray([...arr]); await sleep(5);
        await heapify(n, largest);
      }
    };
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) await heapify(arr.length, i);
    for (let i = arr.length - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setHeapArray([...arr]); await sleep(5);
      await heapify(i, 0);
    }
    const time = Math.round(performance.now() - start);
    setHeapMetrics({ time, count });
    setHeapComparing([]);
    return { name: 'Heap Sort', time };
  };

  const startBattle = async () => {
    setIsSorting(true);
    setWinner(null);
    const results = await Promise.all([
      runBubble([...bubbleArray]),
      runMerge([...mergeArray]),
      runQuick([...quickArray]),
      runSelection([...selectionArray]),
      runInsertion([...insertionArray]),
      runHeap([...heapArray])
    ]);
    const fastest = results.reduce((prev, current) => (prev.time < current.time ? prev : current));
    setWinner(fastest.name);
    setIsSorting(false);
  };

  return (
    <main className="p-4 max-w-7xl mx-auto font-sans bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-black text-center mb-8 text-slate-800 uppercase tracking-tighter italic">The Ultimate Sorting Battle</h1>
      
      <div className="flex justify-center mb-8">
        <button onClick={startBattle} disabled={isSorting} className="px-16 py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full font-black text-2xl shadow-2xl hover:scale-105 transition-all disabled:opacity-30">
          {isSorting ? "SORTING..." : "FIGHT!"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Visualizer title="Bubble Sort" complexity="O(n^2)" metrics={bubbleMetrics} array={bubbleArray} comparing={bubbleComparing} color="bg-slate-400" isWinner={winner === "Bubble Sort"} />
        <Visualizer title="Merge Sort" complexity="O(n log n)" metrics={mergeMetrics} array={mergeArray} comparing={mergeComparing} color="bg-indigo-600" isWinner={winner === "Merge Sort"} />
        <Visualizer title="Quick Sort" complexity="O(n log n)" metrics={quickMetrics} array={quickArray} comparing={quickComparing} color="bg-emerald-500" isWinner={winner === "Quick Sort"} />
        <Visualizer title="Selection Sort" complexity="O(n^2)" metrics={selectionMetrics} array={selectionArray} comparing={selectionComparing} color="bg-amber-500" isWinner={winner === "Selection Sort"} />
        <Visualizer title="Insertion Sort" complexity="O(n^2)" metrics={insertionMetrics} array={insertionArray} comparing={insertionComparing} color="bg-rose-500" isWinner={winner === "Insertion Sort"} />
        <Visualizer title="Heap Sort" complexity="O(n log n)" metrics={heapMetrics} array={heapArray} comparing={heapComparing} color="bg-fuchsia-600" isWinner={winner === "Heap Sort"} />
      </div>

      <button onClick={generateNewData} disabled={isSorting} className="block mx-auto mt-10 text-slate-400 hover:text-slate-600 underline text-sm italic">Generate Random Data</button>
    </main>
  );
}

// 共通のグラフ表示パーツ
function Visualizer({ title, complexity, metrics, array, comparing, color, isWinner }: any) {
  return (
    <div className={`bg-white p-5 rounded-2xl shadow-lg border-b-8 transition-all duration-500 ${isWinner ? 'border-yellow-400 scale-105 ring-4 ring-yellow-200' : 'border-slate-200'}`}>
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className={`font-bold italic flex items-center gap-2 ${color.replace('bg-', 'text-')}`}>
            {title}
            {isWinner && <span className="text-yellow-500 text-xl">👑</span>}
          </h2>
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