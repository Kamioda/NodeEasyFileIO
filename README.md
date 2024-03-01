# Node Easy File IO

このプロジェクトは、Node.jsでのファイルの読み書きの煩わしさを解決するプロジェクトです

## コードBefore/After

例えば、この処理書くの煩わしくないですか？

### JSONファイルの読み込み

このパッケージのファイル```readJson```メソッドは、ファイルを読み込んでJSONに変換してくれる機能が入っているので、```JSON.parse```をわざわざ呼んでJSONに変換する処理を書かずに処理できるので、```readFileSync```と```JSON.parse```の両方を呼び出さなくても済みます。

#### Before

```typescript
import { readFileSync } from 'node:fs';

interface Sample {
    key: string;
    data: string;
}

const fileText = readFileSync('file.json', 'utf-8');
const json = JSON.parse(fileText) as Sample;

// 以下、JSONを使った処理
```

#### After

```typescript
import { readJson } from 'nodeeasyfileio';

interface Sample {
    key: string;
    data: string;
}

const json = readJson<Sample>('file.json');

// 以下、JSONを使った処理
```

### ファイルの書き込み

このパッケージのファイル```writeFile```メソッドには、内部にフォルダ生成処理が含まれているため、わざわざディレクトリの有無の検査をする必要がありません。

#### Before

```typescript
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';

if (existsSync('./hoge')) mkdirSync('./hoge');
writeFileSync('./hoge/file.txt', 'Hello World!', 'utf-8');
```

#### After

```typescript
import { writeFile } from 'nodeeasyfileio';

writeFile('./hoge/file.txt', 'Hello World!', 'utf-8');
```

## メソッドの追加

このプロジェクトは、ファイルの読み書きで１行で、かつ横方向にも短く書けたらいいなを実現していくプロジェクトなので、もしこんな読み書きを短く書けるメソッドがあったらいいなというのがあれば[Issue](https://github.com/Kamioda/NodeEasyFileIO/issues)に書き込んで下さい。

## ライセンス

MIT License
