# SlackMailSync

Slackでメールを受信し、Slackのやり取りとメールのやり取りをSlack上で時系列に見ることができるようになります。  
またメールを指定のチャンネルに転送する機能もあり、アラートメールなどのメールをチャンネルで複数人に共有することが、誰でも手軽に設定できます。

## 機能

### メールサーバ設定

複数のメールサーバを設定でき、後から編集できます。  
<img width="450" alt="スクリーンショット 2023-11-26 1 44 16" src="https://github.com/kajidog/SlackMailSync/assets/51894304/17ce547b-7a6d-448c-81f9-b039f510d55f">

### メールの受信と返信

デフォルトでDMにメールが届きます。   
<img width="450" alt="スクリーンショット 2023-11-13 16 43 03" src="https://github.com/ic-kokusai/SlackMailSync/assets/51894304/521d3ed5-74f2-4ec0-ae72-0fb0bf2e0d1f">　　

### フィルター機能
指定のチャンネルへ転送したりブロックができます。  
<img width="600" alt="スクリーンショット 2023-11-26 5 30 18" src="https://github.com/kajidog/SlackMailSync/assets/51894304/9a6696a3-3de4-4e1e-8deb-e0cd837b9634">
<img width="550" alt="スクリーンショット 2023-11-26 5 38 43" src="https://github.com/kajidog/SlackMailSync/assets/51894304/863da990-f23f-4bf5-942a-25dfe2f751a8">


## 構築手順

### 使用言語・環境

- Docker Desktop
- Node.js v18.0
- TypeScript
- @slack/bolt
- sqlite3


注意：Slackのメール機能を使用するため、Slackが`Proプラン`以上の必要あり

### Slack Bolt

1. docker desktopをインストール
2. ソースコードダウンロード
3. 以下のコマンドを実行
   ```bash
   cd SlackMailSync
   cp .env.example .env
   make init
   ```
4. SlackとSMTPの設定が完了し`.env`ファイル編集後、以下のコマンドで起動
   ```bash
   make up
   ```

### Slackの設定

1. Slack Bot作成  
   `./AppManifest.yml`を参考にアプリを作成し、Slackのワークスペースにアプリをインストール  
   インストール後に生成される`Bot User OAuth Token`を`.env`ファイルの`SLACK_BOT_TOKEN`に設定  
2. App-Level Tokensを設定  
   `connections:write`のApp-Level Tokensを生成して、`.env`ファイルの`SLACK_APP_TOKEN`に設定  
   <img width="500" alt="スクリーンショット 2023-11-26 1 49 18" src="https://github.com/kajidog/SlackMailSync/assets/51894304/3f91c41b-c3e4-45a6-add6-1f6f8ee61f53">
3. メール受信用のチャンネルを作成
4. 受信用のチャンネルに届くメールアドレスを作成  
   <img width="500" alt="スクリーンショット 2023-11-26 2 02 47" src="https://github.com/kajidog/SlackMailSync/assets/51894304/03d84942-9137-4a91-b054-0a1fea6ae3ca">  
5. チャンネルIDとそのチャンネルのメールアドレスを`.env`の`SLACK_MAIL_BOX_CHANNEL_ID`と`SLACK_MAIL_BOX_CHANNEL_EMAIL`に設定

### システムのSMTPサーバを設定

取得したユーザーのメールを、Slackに転送するために使用するSMTPサーバ

.envファイルの以下のパラメータにそれぞれ設定

```text
SYSTEM_SMTP_HOST=
SYSTEM_SMTP_PORT=
SYSTEM_SMTP_SECURE=false
SYSTEM_SMTP_USER=
SYSTEM_SMTP_PASS=
```

以上
