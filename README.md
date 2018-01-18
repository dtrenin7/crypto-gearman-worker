# crypto-gearman-worker

## типовой файл настроек (config.ini):

[server]
publicKey=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwnIRYoiJ2nwMCyxmNnGKTNjLKwTSOE/OKk5nNEMNB+5cIXiAzFTGLTWhZ3BLX9MLHSgJl1daxBX1MK1CyWmjviHmAB4OSbR1eOUBnGdsw3/GNfUQmihVoQsODFHoT44dFziKR9bWlXMW4uSpkXt/bUNyafJupRq462AEg782wue7PV8F0CghcpTaVOLMtvXoFQHs3YnJ/nW04NsjsES/1vMW4V8cwPbImwokq1o4BM+Wo01lE2R2cq+COVtmnyu+0gC7ZRAdg5w1pS8coF6YRKzJrP9JiG21BSUNmXrkkqMtbHMnC2MHY/hSYwDFvgviCOLgBSRTg1HXwQIYXxNMwwIDAQAB
privateKey=MIIEpAIBAAKCAQEAwnIRYoiJ2nwMCyxmNnGKTNjLKwTSOE/OKk5nNEMNB+5cIXiAzFTGLTWhZ3BLX9MLHSgJl1daxBX1MK1CyWmjviHmAB4OSbR1eOUBnGdsw3/GNfUQmihVoQsODFHoT44dFziKR9bWlXMW4uSpkXt/bUNyafJupRq462AEg782wue7PV8F0CghcpTaVOLMtvXoFQHs3YnJ/nW04NsjsES/1vMW4V8cwPbImwokq1o4BM+Wo01lE2R2cq+COVtmnyu+0gC7ZRAdg5w1pS8coF6YRKzJrP9JiG21BSUNmXrkkqMtbHMnC2MHY/hSYwDFvgviCOLgBSRTg1HXwQIYXxNMwwIDAQABAoIBAQCbiXD8l2ll2kor+eT88c+F7vh9PcsGflfUoYiOVoAq8vDBWUn1qG4ppbepLTstuHwwY2FgrOCO712FBWLiB92R7j2zpFcbf/1jqhOiz1xB+YhMiu4v0cnFGzmugypH0M7WT0TVeDWHsFsDPZOiKt5gQU5ZDzKQYRLAPLr/w8mDF0AQGoaSkcb6sBwhwtqvwNMMVy7bx9tPlhgLLRzX6ALqT7p1uw/cEuIoZ/kdFj1P6qYsckqPhH6bBc1qJ49f6K6QUhlSPQgeZNFEm3lg3CjiYieUTFKu2sheud26Uzbu3rqzMRXmFiV7tk+2/JIY7cduxSW+q9EH2uDVF255OgFpAoGBAP9TQPY5gu+ccggHc5s5kIMxF869PF4TTyzBYLZgRSRMB47NOZJeKV0Lhgyo1n107Yt1ZdWwcjyjMcKLntAFrWXXawlXQTJVZHf8mfQeMh/t5mlti5luW38KN1vkEJrt/TMjy/pE+n189VHL63obRkCn/VhTdMGEklY0l7AxuI6HAoGBAML1n+arnhnzIMf4TYy6OHpd0QfquAKSnQSw6xm6m47uqM05h/JvVFiXnejXWpClwDYbwDcDbrOui85HtDrzj9PiD+w2iKF+WVcIZTGrA/RC2wNhAYKkT8sxhLHq7qARfXtsqLZ0l6pGWvWMJeEAIK3BT4kNc3eqabtClnx4G0LlAoGBALPDrBMv/s4xOeAJTw3VA7g6kmaOubgKpE4AgNUnBsc9eHzEZWp2PW0zNdgn74w5DR6JM3+2UVf8FobAwrn3pVP0zXmwI0kK8kfAY6yKrgPo/bbw177ZAjZ5vOxHsKFEOmcNJwo4EpzTo+1JQ6ufFGFlZWwQpj2x1042jS4Sc7x1AoGAAfpuEfAh3Y+LAJxzZP8qvYsgKN1n2pbUQwzshclP9MZVLifsSjh4+aEoOAmfYKJd7e6gJ67AO9CEmKY/nO2FwxejI7l173WRwIFUTYm3s43OHR2p30J9kMlC2G9S1or24/65Q4ixVUf7ekxewga3TiwM+44IYul2wzCsyDyLwkUCgYAmMsmunPrAfwgvK1J1shInMlbrA8shnjn4lFlyOlmJ1P2xRD6q2kDaT29cGXJ6vz12V0gAYWeq3IQ7iISqvdt48yt6TKWQcqAGBkARLL1ZHEoAv6+lDhFDcaifZZUBgNwacEJH0ZLIWEXeh3GXIslg7c1x8aKeWufI1JMrVVvFBA==
host=0.0.0.0
port=4730
threads=4
timeout=100

[ethereum-local]
db=/db2
ipc=/db2/geth.ipc

[ethereum-real]
db=/mnt/db
ipc=/mnt/db/geth.ipc

[ethereum-common]
network=local
scripts=/home/dtrenin/job/crypto-gearman-worker/src/scripts
geth=geth

## настройки могут быть перегружены через переменные окружения:

GEAR_DB       < путь к базе данных
GEAR_IPC      < путь к .ipc файлу с настройками
GEAR_SCRIPTS  < путь к каталогу с .js скриптами
GEAR_GETH     < путь к geth
GEAR_HOST     < адрес хоста для прием задач
GEAR_PORT     < порт для приема задач
GEAR_THREADS  < кол-во рабочих потоков
GEAR_TIMEOUT  < тайм-аут для рабочих потоков

## запуск
> ./crypto-gearman-worker

...
[INFO] Reading settings done...                                                                           │
All 4 threads created successfully.
