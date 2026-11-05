{{/* Chart name, overridable with nameOverride. */}}
{{- define "nesthub.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Full name of the release: every object name is built from it, so the chart can
be installed several times into one cluster. "nesthub" + release "nesthub" ->
"nesthub"; release "demo" -> "demo-nesthub".
*/}}
{{- define "nesthub.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/* Name of a component object: <fullname>-<component>. Usage: include "nesthub.componentName" (list . "api") */}}
{{- define "nesthub.componentName" -}}
{{- $ctx := index . 0 }}
{{- printf "%s-%s" (include "nesthub.fullname" $ctx) (index . 1) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "nesthub.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/* Labels shared by every object. */}}
{{- define "nesthub.labels" -}}
helm.sh/chart: {{ include "nesthub.chart" . }}
app.kubernetes.io/part-of: {{ include "nesthub.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/* Selector labels of a component. Usage: include "nesthub.selectorLabels" (list . "api") */}}
{{- define "nesthub.selectorLabels" -}}
{{- $ctx := index . 0 }}
app.kubernetes.io/name: {{ include "nesthub.name" $ctx }}-{{ index . 1 }}
app.kubernetes.io/instance: {{ $ctx.Release.Name }}
app.kubernetes.io/component: {{ index . 1 }}
{{- end }}

{{/* Common + selector labels of a component. */}}
{{- define "nesthub.componentLabels" -}}
{{ include "nesthub.labels" (index . 0) }}
{{ include "nesthub.selectorLabels" . }}
{{- end }}

{{/* Image reference; an empty tag falls back to Chart.appVersion. Usage: include "nesthub.image" (list . .Values.api.image) */}}
{{- define "nesthub.image" -}}
{{- $ctx := index . 0 }}
{{- $image := index . 1 }}
{{- printf "%s:%s" $image.repository (default $ctx.Chart.AppVersion ($image.tag | toString)) }}
{{- end }}

{{- define "nesthub.configName" -}}{{ include "nesthub.componentName" (list . "config") }}{{- end }}
{{- define "nesthub.secretName" -}}{{ include "nesthub.componentName" (list . "secret") }}{{- end }}
{{- define "nesthub.dbHost" -}}{{ include "nesthub.componentName" (list . "db") }}{{- end }}

{{/*
Value of a Secret key, base64-encoded: the value from .Values if set, else the
value already stored in the cluster (kept across upgrades), else a new random one.
Usage: include "nesthub.secretValue" (list $existingData "KEY" .Values.secrets.x)
*/}}
{{- define "nesthub.secretValue" -}}
{{- $existing := index . 0 }}
{{- $key := index . 1 }}
{{- $value := index . 2 }}
{{- if $value }}
{{- $value | b64enc }}
{{- else if and $existing (hasKey $existing $key) }}
{{- index $existing $key }}
{{- else }}
{{- randAlphaNum 32 | b64enc }}
{{- end }}
{{- end }}
