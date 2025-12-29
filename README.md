# 🚀 Algorithm Battle Visualizer

MIT OCWやPrincetonのアルゴリズム講義で学んだ概念を、React(Next.js)を用いて可視化したベンチマークツールです。
単なる実装に留まらず、計算量の違いを「定量的」かつ「視覚的」に比較することを目的に開発しました。

## 🔗 Live Demo
[https://algorithm-visualizer-three-jet.vercel.app/]

## 🛠 Features

- **リアルタイム並列比較**: 異なるアルゴリズムを同じデータセットで同時に走らせ、実行速度の差を視覚化。
- **スケーラビリティ・テスト**: データ数を100個まで増やし、データ量が増加した際の計算量（Big O）の影響を実証。
- **パフォーマンス計測**: 実行時間(ms)と、アルゴリズム内部での比較回数をカウントし、効率性を数値化。

## 🧬 Implemented Algorithms

| Algorithm | Time Complexity | Strategy |
| :--- | :--- | :--- |
| **Bubble Sort** | $O(n^2)$ | Brute Force (隣接要素の入れ替え) |
| **Merge Sort** | $O(n \log n)$ | Divide and Conquer (分割統治法) |

## 💡 Key Learnings (PM Perspective)

このプロジェクトを通じて、以下の技術的・PM的視点を学びました。
- **技術選定**: 高速な開発とデプロイを実現するため、Next.js + Tailwind CSS + Vercel を採用。
- **State管理**: Reactの `useState` を用いた動的なUI更新と、非同期処理（`async/await`）による実行ステップの制御。
- **エンジニアリングワークフロー**: Gitによるバージョン管理と、GitHub/Vercelを連携させたCI/CDの構築。

## 🛠 Tech Stack
- **Frontend**: React (Next.js), TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel