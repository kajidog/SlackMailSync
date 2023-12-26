# SlackMailSync

メールのやり取りをSlack上で確認することができ、Slackからメールの返信も送れます。  
指定のチャンネルに転送する機能があり、アラートメールなどのメールを手軽に誰でも指定のチャンネルに転送できます。
 
複数メールアカウントを使用するため`IMAP IDLE`はリソースがかかるのと、リアルタイム性もそこまで求められていないため、  
定期的にIMAPに接続する方式で、新着メールをSlackに転送してます。 

## 機能

### メールサーバ設定

複数のメールサーバを設定でき、後から編集できます。  


### メールの受信と返信

デフォルトでDMにメールが届きます。   


### フィルター機能
指定のチャンネルへ転送したりブロックができます。  


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
3. メール受信用のチャンネルを作成
4. 受信用のチャンネルに届くメールアドレスを作成  
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
